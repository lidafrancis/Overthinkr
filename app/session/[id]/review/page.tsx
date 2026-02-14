import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ReviewWizard from './ReviewWizard';

export default async function ReviewPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    const { id } = await params;

    // TODO: Verify session status / owner?
    // Assume if they got here, they are ready to review.
    // Ideally check if status is LOCKED or IN_PROGRESS (?)

    // Unlock cost passed down?
    const unlockCost = 20;

    return <ReviewWizard sessionId={id} unlockCost={unlockCost} />;
}
