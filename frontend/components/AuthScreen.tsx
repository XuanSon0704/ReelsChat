import { SignIn } from "@clerk/clerk-react";

export function AuthScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            ReelsChat
          </h1>
          <p className="text-slate-400">Real-time messaging with style</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-slate-900/50 backdrop-blur-sm border border-slate-800"
            }
          }}
        />
      </div>
    </div>
  );
}
