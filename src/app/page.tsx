import { BarChart3, BriefcaseBusiness, ClipboardList, ShieldCheck, UserCog, Users } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";

const projectRows = [
  ["ERP Modernization", "Technology", "In progress", "74%"],
  ["Branch Operations Audit", "Operations", "At risk", "48%"],
  ["Customer Portal Refresh", "Marketing", "In progress", "61%"],
  ["Quarterly Budget Review", "Finance", "Complete", "100%"]
];

export default function Home() {
  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">MIS</span>
          <span>
            <h1>SAMIS Management Portal</h1>
            <p>Operational dashboards for decisions, teams, and service delivery</p>
          </span>
        </a>
        <nav className="nav" aria-label="Dashboard navigation">
          <a href="#admin">Admin</a>
          <a href="#manager">Manager</a>
          <a href="#staff">Staff</a>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Management Information System</p>
            <h2>One home screen for performance, people, projects, and support work.</h2>
            <p>
              Track departmental health, monitor project delivery, review operational tickets, and jump
              directly into role-specific dashboards with fast access login buttons.
            </p>
            <div className="metric-row">
              <div className="metric">
                <strong>10</strong>
                <span>Supabase data tables</span>
              </div>
              <div className="metric">
                <strong>100+</strong>
                <span>Mock records seeded</span>
              </div>
              <div className="metric">
                <strong>3</strong>
                <span>Fast access dashboards</span>
              </div>
            </div>
          </div>

          <aside className="login-panel" aria-label="Fast access login">
            <h3>Fast Access Login</h3>
            <div className="button-stack">
              <a className="quick-button primary" href="#admin">
                <ShieldCheck size={18} /> Admin Dashboard
              </a>
              <a className="quick-button" href="#manager">
                <UserCog size={18} /> Manager Dashboard
              </a>
              <a className="quick-button" href="#staff">
                <Users size={18} /> Staff Dashboard
              </a>
            </div>
          </aside>
        </section>

        <section className="dashboard-grid" aria-label="Role dashboards">
          <DashboardCard
            title="Admin Dashboard"
            icon={BarChart3}
            items={[
              { label: "Active departments", value: "10", tone: "green" },
              { label: "Open security tickets", value: "3", tone: "amber" },
              { label: "Monthly spend", value: "$428K" }
            ]}
          />
          <DashboardCard
            title="Manager Dashboard"
            icon={BriefcaseBusiness}
            items={[
              { label: "Projects in delivery", value: "8", tone: "green" },
              { label: "Tasks due this week", value: "16", tone: "amber" },
              { label: "Budget utilization", value: "67%" }
            ]}
          />
          <DashboardCard
            title="Staff Dashboard"
            icon={ClipboardList}
            items={[
              { label: "Assigned tasks", value: "24", tone: "green" },
              { label: "Pending tickets", value: "11", tone: "amber" },
              { label: "Announcements", value: "10" }
            ]}
          />
        </section>

        <section className="table-panel" aria-label="Project delivery snapshot">
          <h3>Project Delivery Snapshot</h3>
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Department</th>
                <th>Status</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {projectRows.map(([project, department, status, progress]) => (
                <tr key={project}>
                  <td>{project}</td>
                  <td>{department}</td>
                  <td>
                    <span
                      className={
                        status === "Complete"
                          ? "pill green"
                          : status === "At risk"
                            ? "pill red"
                            : "pill amber"
                      }
                    >
                      {status}
                    </span>
                  </td>
                  <td>{progress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
