'use strict'
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Save, Plus, ArrowUpRight, TrendingUp } from 'lucide-react'

interface FinanceClientProps {
  ledger: any[]
  userRole: string
  userId: string
}

export default function FinanceClient({ ledger: initialLedger, userRole, userId }: FinanceClientProps) {
  const supabase = createClient()
  const [ledger, setLedger] = useState<any[]>(initialLedger)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Input states
  const [salary, setSalary] = useState('0')
  const [savings, setSavings] = useState('0')
  const [debt, setDebt] = useState('0')
  const [monthlySavings, setMonthlySavings] = useState('0')
  const [investment, setInvestment] = useState('0')
  const [emergencyFund, setEmergencyFund] = useState('0')
  const [targetSalary, setTargetSalary] = useState('0')
  const [targetSavings, setTargetSavings] = useState('0')

  const latest = ledger[ledger.length - 1] || {
    salary: 0,
    savings: 0,
    debt: 0,
    monthly_savings: 0,
    investment: 0,
    emergency_fund: 0,
    target_salary: 0,
    target_savings: 0,
  }

  const handleInsert = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('finance')
        .insert([{
          user_id: userId,
          salary: parseFloat(salary),
          savings: parseFloat(savings),
          debt: parseFloat(debt),
          monthly_savings: parseFloat(monthlySavings),
          investment: parseFloat(investment),
          emergency_fund: parseFloat(emergencyFund),
          target_salary: parseFloat(targetSalary),
          target_savings: parseFloat(targetSavings),
          recorded_date: new Date().toISOString().split('T')[0]
        }])
        .select()

      if (err) throw err

      setLedger([...ledger, data[0]])
      setShowForm(false)
    } catch (err: any) {
      setError(err?.message || 'Failed to save entry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Salary vs Target</p>
          <h3 className="text-2xl font-bold text-neutral-900 mt-1">₹{latest.salary}</h3>
          <p className="text-xs text-neutral-400 mt-1">Target: ₹{latest.target_salary}</p>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Savings</p>
          <h3 className="text-2xl font-bold text-neutral-900 mt-1">₹{latest.savings}</h3>
          <p className="text-xs text-neutral-400 mt-1">Target: ₹{latest.target_savings}</p>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Active Debt</p>
          <h3 className="text-2xl font-bold text-red-500 mt-1">₹{latest.debt}</h3>
          <p className="text-xs text-neutral-400 mt-1">Target: Reduction to 0</p>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Investments</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">₹{latest.investment}</h3>
          <p className="text-xs text-neutral-400 mt-1">Emergency Fund: ₹{latest.emergency_fund}</p>
        </div>
      </div>

      {/* Main Grid: Chart & Admin Action Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart View */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">Savings & Debt Growth</h3>
            <TrendingUp className="h-5 w-5 text-neutral-400" />
          </div>
          <div className="h-72 w-full">
            {ledger.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ledger}>
                  <XAxis dataKey="recorded_date" stroke="#A3A3A3" fontSize={10} tickLine={false} />
                  <YAxis stroke="#A3A3A3" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#FFF', borderRadius: '12px', border: '1px solid #F0F0F0' }} />
                  <Area type="monotone" dataKey="savings" stroke="#2563EB" fillOpacity={0.1} fill="#2563EB" name="Savings" />
                  <Area type="monotone" dataKey="debt" stroke="#EF4444" fillOpacity={0.1} fill="#EF4444" name="Debt" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-neutral-400">
                No historical records log found.
              </div>
            )}
          </div>
        </div>

        {/* Add Entry Card */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
          {userRole === 'Admin' ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-neutral-900">Add Log</h3>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center space-x-1 rounded-xl bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>{showForm ? 'Cancel' : 'New Entry'}</span>
                </button>
              </div>

              {showForm && (
                <form onSubmit={handleInsert} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase">Salary (₹)</label>
                      <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase">Savings (₹)</label>
                      <input
                        type="number"
                        value={savings}
                        onChange={(e) => setSavings(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase">Debt (₹)</label>
                      <input
                        type="number"
                        value={debt}
                        onChange={(e) => setDebt(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase">Monthly Savings (₹)</label>
                      <input
                        type="number"
                        value={monthlySavings}
                        onChange={(e) => setMonthlySavings(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase">Investment (₹)</label>
                      <input
                        type="number"
                        value={investment}
                        onChange={(e) => setInvestment(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase">Emergency Fund (₹)</label>
                      <input
                        type="number"
                        value={emergencyFund}
                        onChange={(e) => setEmergencyFund(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase">Target Salary (₹)</label>
                      <input
                        type="number"
                        value={targetSalary}
                        onChange={(e) => setTargetSalary(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase">Target Savings (₹)</label>
                      <input
                        type="number"
                        value={targetSavings}
                        onChange={(e) => setTargetSavings(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Record'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <p className="text-neutral-500 text-sm text-center">
              You are signed in as a Viewer. All metrics are read-only.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
