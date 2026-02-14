import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Session from '@/lib/models/Session';
import User from '@/lib/models/User';
import GemTransaction from '@/lib/models/GemTransaction';
import { getUser } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { postAssessmentData, gemsSpent } = await req.json();

        if (!postAssessmentData || gemsSpent === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Transaction logic removed for standalone MongoDB compatibility

        try {
            const userDoc = await User.findById(user.id);
            if (!userDoc) {
                throw new Error('User not found');
            }

            if (userDoc.gems < gemsSpent) {
                throw new Error('Insufficient gems');
            }

            const journalSession = await Session.findOne({
                _id: id,
                userId: user.id,
            });

            if (!journalSession) {
                throw new Error('Journal session not found');
            }

            // Deduct gems if any (unlock cost)
            if (gemsSpent > 0) {
                userDoc.gems -= gemsSpent;
                await userDoc.save();

                await GemTransaction.create({
                    userId: user.id,
                    amount: -gemsSpent,
                    type: 'SPEND',
                    description: `Unlocked session: ${journalSession._id}`,
                    relatedEntityId: journalSession._id,
                    relatedEntityType: 'UNLOCK',
                });
            }

            // Update Session
            // Calculate final score based on post-assessment (1-10 scale assumed)
            const finalStressScore = (postAssessmentData.stress || 5) * 10;

            journalSession.status = 'UNLOCKED';
            journalSession.postTaskAssessment = postAssessmentData;
            journalSession.finalStressScore = finalStressScore;

            await journalSession.save();

            // Re-fetch to ensure we have latest state if needed
            const updatedUser = await User.findById(user.id);

            return NextResponse.json({
                success: true,
                session: journalSession,
                analysis: journalSession.sentimentData, // Return the hidden analysis now
                newBalance: updatedUser?.gems,
            });

        } catch (error: any) {
            console.error('Unlock Logic Error:', error);
            throw error;
        }
    } catch (error: any) {
        console.error('Unlock Route Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
