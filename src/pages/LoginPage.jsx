import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, ShieldCheck, ArrowRight } from "lucide-react";
import { useLogistics } from "../context/LogisticsContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useLogistics();

  const [email, setEmail] = useState("pankaj.saha@nexuslogistics.in");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md mb-4">
          <Compass className="w-7 h-7 stroke-[2.2]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Nexus Logistics OS
        </h1>
        <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
          Enterprise Cloud Fleet & Delivery Operations Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-sm border border-slate-200 rounded-xl">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-800">
              Sign in to Operations Console
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your operator credentials to access dispatch management.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700"
              >
                Operator Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                  placeholder="operator@nexuslogistics.in"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700"
                >
                  Password
                </label>
                <span className="text-xs text-slate-400">
                  Secured
                </span>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-slate-600"
                >
                  Remember this terminal
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xs transition-colors"
              >
                <span>Launch Operations Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Enterprise Access Control Box */}
          <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Enterprise Access Control</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Operational console authenticated for active logistics management and dispatch administration.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Nexus Logistics OS · Enterprise Operations Console
        </p>
      </div>
    </div>
  );
}
