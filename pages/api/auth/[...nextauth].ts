import NextAuth, { NextAuthOptions} from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { dbUsers } from "@/database";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
    }
}  
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
    providers: [
        
        // ...add more providers here

        Credentials({
            name: 'Email',
            credentials: {
                email: { label: 'Email:', type: 'email', placeholder: 'email@gmail.com'},
                password: { label: 'Password:', type: 'password', placeholder: 'Your password'},
            },
            async authorize(credentials) {
                //console.log(credentials, 'desde archivo [...nextauth.js]')
                //TODOS: validate agains the
                // return null
                
                // return { id: 'somestring', name: 'James Tuyuc', email: 'someexample@gmail.com', role: 'admin'}
                const data = await dbUsers.checkUserEmailPassword(credentials?.email!, credentials?.password!)
                if (data) {
                    return { ...data, id: data._id}
                }
                return null
            }
        }),
        GithubProvider({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    
    // CUSTOM PAGES
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register'
    },

    session: {
        maxAge: 2592000, // Equivalente to 30 days
        strategy: 'jwt', // Way to renovate the token
        updateAge: 86400, // Equivalente to 1 day
    },

    jwt: {
        // Handle JSONWEBTOKENS
    },
    callbacks: {
        async jwt({ token, account, user }) {
            
            //console.log(token, account, user, 'desde callback jwt')
            //console.log(token, 'tokentokentoken')
            //console.log(account, 'accountaccount')
            //console.log(user, 'useruseruser')
            if (account) {
                token.accessToken = account.access_token

                switch (account.type) {
                    case 'oauth':
                        // Validar en base de datos
                        token.user = await dbUsers.oAuthToDBUser(user?.email || '', user?.name || '')
                        break;
                    case 'credentials':
                        token.user = user
                        break;
                }
            }
            return token
        },
        async session({ session, token, user}){
        //console.log(session, '*-*-*-*-*-*session*-*-*-*-*-');
        //console.log(token, '-*-*-*-*-*-*-*token*-*-*-*-*-*')
        //console.log(user, '-*-*-*-*-*-*user*-*-*-*-*-*-')
        //console.log(user, 'user')
        session.accessToken = token.accessToken as string;
        session.user = token.user as any;

        return session;
        }
    }
}
export default NextAuth(authOptions)