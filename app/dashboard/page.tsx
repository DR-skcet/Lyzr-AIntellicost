import { DashboardLayout } from "@/components/dashboard-layout"
import OptimizationForm from "@/components/optimization-form"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Cost Optimization</h1>
          <p className="text-gray-300 mt-2">
            Get instant LLM suggestions, credit planning, and ROI insights tailored to your AI use case.
          </p>
        </div>
        <OptimizationForm />
      </div>
    </DashboardLayout>
  )
}
