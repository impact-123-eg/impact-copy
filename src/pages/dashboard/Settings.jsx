import { useState } from "react";
import AdminProfile from "../../Components/dashboard/AdminProfile";
import { Link } from "react-router-dom";
import { useGetAllEmployees } from "@/hooks/Actions/users/useCurdsUsers";
import Employee from "@/Components/dashboard/Employee";
import { useAuth } from "@/context/AuthContext";
import { Search, Users, Shield, Briefcase, GraduationCap, Headset } from "lucide-react";

const RoleTable = ({ title, employees, icon: Icon, colorClass }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phoneNumber.includes(searchTerm) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className={`p-5 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30`}>
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{title}</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{filteredEmployees.length} Members</p>
          </div>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--Yellow)] focus:ring-4 focus:ring-[var(--Yellow)]/10 outline-none transition-all text-sm"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 font-bold text-gray-500 text-[11px] uppercase tracking-widest border-b border-gray-50">
            <tr>
              <th className="px-6 py-4">Member Info</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Working Shift</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map(emp => (
                <Employee key={emp._id} employee={emp} />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 italic bg-gray-50/10">
                  No {title.toLowerCase()} match your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function Settings() {
  const { data: empData } = useGetAllEmployees();
  const { user } = useAuth();
  const employees = empData?.data?.data?.filter((emp) => emp._id !== user.id) || [];

  const groups = [
    {
      title: "Administrators",
      icon: Shield,
      colorClass: "bg-purple-50 text-purple-600",
      roles: ["admin", "supervisor"]
    },
    {
      title: "Sales Team",
      icon: Briefcase,
      colorClass: "bg-blue-50 text-blue-600",
      roles: ["sales", "team_leader"]
    },
    {
      title: "Instructors",
      icon: GraduationCap,
      colorClass: "bg-emerald-50 text-emerald-600",
      roles: ["instructor"]
    },
    {
      title: "Customer Support",
      icon: Headset,
      colorClass: "bg-orange-50 text-orange-600",
      roles: ["cs"]
    }
  ];

  return (
    <main className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="font-black text-4xl text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-2 font-medium">
            Configure your system and manage your global team
          </p>
        </div>
        <Link
          onClick={() => window.scroll(0, 0)}
          to="/dash/settings/add-employee"
          className="px-6 py-3 rounded-2xl bg-[var(--Yellow)] text-[var(--Main)] font-bold hover:shadow-lg hover:shadow-[var(--Yellow)]/30 transition-all duration-300 flex items-center gap-2"
        >
          <Users className="w-5 h-5" />
          Add New Member
        </Link>
      </div>

      {/* Profile Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[var(--Yellow)]"></div>
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <Shield className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h3 className="font-bold text-2xl text-gray-900">Personal Account</h3>
            <p className="text-gray-500 text-sm">Your administrative profile and contact details</p>
          </div>
        </div>
        <AdminProfile />
      </section>

      {/* Team Sections */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Users className="w-5 h-5 text-[var(--Yellow)]" />
          <h2 className="font-bold text-xl text-gray-800 tracking-tight text-right">Team Directory</h2>
        </div>

        {groups.map(group => {
          const groupEmps = employees.filter(emp => group.roles.includes(emp.role));
          if (groupEmps.length === 0) return null;
          return (
            <RoleTable
              key={group.title}
              title={group.title}
              icon={group.icon}
              colorClass={group.colorClass}
              employees={groupEmps}
            />
          );
        })}

        {/* Catch-all for other roles if any */}
        {(() => {
          const categorizedIds = groups.flatMap(g => g.roles);
          const otherEmps = employees.filter(emp => !categorizedIds.includes(emp.role));
          if (otherEmps.length === 0) return null;
          return (
            <RoleTable
              title="Other Members"
              icon={Users}
              colorClass="bg-gray-50 text-gray-600"
              employees={otherEmps}
            />
          );
        })()}
      </div>
    </main>
  );
}

export default Settings;
