import { getServerSession } from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './db';
import User from './models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                await dbConnect();
                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    return null;
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                );

                if (!isValid) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub!;
            }
            return session;
        },
    },
};

export async function getUser() {
    const session = await getServerSession(authOptions);
    return session?.user;
}
