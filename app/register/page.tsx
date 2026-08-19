import { RegisterPage } from '@/components/register'

const RegisterForm = () => {
  return (
    <div className="min-h-screen w-full flex bg-[#0a0a0a]">
      
      {/* ========== LEFT SIDE - IMAGE ========== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLJVskLrZ3R_8MKt4qQpQ_6LcD73C2dWvoNyDJJMdDLg&s=10')",
          }}
        />
        
        {/* Dark + Purple Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-950/50 to-black/70" />

        {/* Text Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div>
            <h2 className="text-4xl font-bold tracking-tight leading-tight">
              Join Us Today
            </h2>
            <p className="mt-3 text-zinc-300 text-lg max-w-sm">
              Create your account and start your creative journey.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-1 w-16 bg-purple-500 rounded-full" />
            <p className="text-sm text-zinc-400">
              Professional platform for artists & creators
            </p>
          </div>
        </div>
      </div>

      {/* ========== RIGHT SIDE - REGISTER FORM ========== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#f8f7fc]">
        <div className="w-full max-w-md">
          <RegisterPage />
        </div>
      </div>
    </div>
  )
}

export default RegisterForm