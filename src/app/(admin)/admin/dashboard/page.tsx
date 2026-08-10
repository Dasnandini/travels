import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Users, Bus, Key, Activity, CheckCircle2, MapPin, Route as RouteIcon, Calendar, ArrowRight } from "lucide-react";
import { ClientLogoutButton } from "@/components/auth/client-logout-button";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin Dashboard | Bus Reservation System",
  description: "Privileged administration portal dashboard",
};

export default async function AdminDashboardPage() {
  const { user } = await requireAdmin();

  // Fetch recent audit logs for the admin dashboard view
  const recentLogs = await prisma.auditLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const totalUsers = await prisma.user.count();
  const totalStops = prisma.stop ? await prisma.stop.count() : 0;
  const totalRoutes = prisma.route ? await prisma.route.count() : 0;
  const totalBuses = prisma.bus ? await prisma.bus.count() : 0;
  const totalServices = prisma.busService ? await prisma.busService.count() : 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#002B66] flex items-center justify-center font-bold shadow-inner">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Welcome, {user.name || "Administrator"}</h1>
            <p className="text-xs text-slate-500">System Administration & Operations Control</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="gap-1 px-3 py-1 bg-[#002B66] text-white border-none font-semibold text-xs shadow-sm">
            <Key className="h-3.5 w-3.5" />
            <span>ROLE: {user.role}</span>
          </Badge>
          <ClientLogoutButton />
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Registered Users
            </CardTitle>
            <Users className="h-4 w-4 text-[#002B66]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalUsers}</div>
            <p className="text-xs text-slate-500">User accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Network Nodes
            </CardTitle>
            <MapPin className="h-4 w-4 text-[#002B66]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {totalStops} Stops / {totalRoutes} Routes
            </div>
            <p className="text-xs text-slate-500">Geographical network</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Fleet
            </CardTitle>
            <Bus className="h-4 w-4 text-[#002B66]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 font-mono">{totalBuses} Buses</div>
            <p className="text-xs text-slate-500">Registered vehicles</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Bus Services
            </CardTitle>
            <Calendar className="h-4 w-4 text-[#002B66]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 font-mono">{totalServices} Schedules</div>
            <p className="text-xs text-slate-500">Active timetables</p>
          </CardContent>
        </Card>
      </div>

      {/* Operations Quick Action Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Operations Management Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/dashboard/operations/stops"
            className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-900 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#002B66] flex items-center justify-center font-bold">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#002B66] transition-colors">
                Stops & Locations
              </h3>
              <p className="text-xs text-slate-500">
                Google Places search, coordinates, and boarding points.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#002B66] gap-1">
              <span>Manage Stops</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/admin/dashboard/operations/routes"
            className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-900 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#002B66] flex items-center justify-center font-bold">
                <RouteIcon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#002B66] transition-colors">
                Routes & Journeys
              </h3>
              <p className="text-xs text-slate-500">
                Route codes, start/end destinations, and stop reordering.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#002B66] gap-1">
              <span>Manage Routes</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/admin/dashboard/operations/buses"
            className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-900 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#002B66] flex items-center justify-center font-bold">
                <Bus className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#002B66] transition-colors">
                Buses & Seat Layouts
              </h3>
              <p className="text-xs text-slate-500">
                Fleet registration, sleeper/seater types, and 2D layout editor.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#002B66] gap-1">
              <span>Manage Fleet</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/admin/dashboard/operations/services"
            className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-900 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#002B66] flex items-center justify-center font-bold">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#002B66] transition-colors">
                Services & Schedules
              </h3>
              <p className="text-xs text-slate-500">
                Operating days, arrival/departure timetables, and boarding flags.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[#002B66] gap-1">
              <span>Manage Schedules</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Security Audit Events */}
      <Card className="bg-white border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-slate-900">
            <Activity className="h-5 w-5 text-[#002B66]" />
            <span>Recent Security Audit Events</span>
          </CardTitle>
          <CardDescription className="text-slate-500">
            System-wide authentication and authorization audit trail
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No audit log records recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[#002B66] border-blue-200 bg-blue-50">
                      {log.action}
                    </Badge>
                    <span className="text-slate-700 font-mono">Actor: {log.actorId || "System/Public"}</span>
                  </div>
                  <span className="text-slate-400 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
