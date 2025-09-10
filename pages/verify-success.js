import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'

export default function VerifySuccess() {
  const router = useRouter()
  const { email } = router.query

  return (
    <>
      <Head>
        <title>Email Verified | Mobile Bio Lab</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
            <div className="mb-6">
              <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified Successfully!</h2>
            
            <p className="text-gray-600 mb-6">
              Your email {email} has been successfully verified. You can now log in to your account.
            </p>

            <Link
              href="/login"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}