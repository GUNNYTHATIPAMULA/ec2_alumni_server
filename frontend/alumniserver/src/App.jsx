import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layout/MainLayout"
import Loginpage from "./pages/Loginpage"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AlumniLayout from "./layout/AlumniLayout"
import AdminLayout from "./layout/AdminLayout"
import StudentLayout from "./layout/StudentLayout"
import Alumni_Dashboard from "./pages/alumni/Alumni_Dashboard"
import All_Alumni from "./pages/alumni/All_Alumni"
import Alumni_Profile from "./pages/alumni/Alumni_Profile"
import Job_Page from "./pages/alumni/Job_Page"
import MentorshipHub from "./pages/alumni/MentorshipHub"
import Events_alumni from "./pages/alumni/Events_alumni"
import Settings from "./pages/alumni/Settings"
import Alumni_connection from "./pages/alumni/Alumni_connection"
import Contributions from "./pages/alumni/Contributions"
import Notifications from "./pages/alumni/Notifications"
import Admin_Dashboard from "./pages/admin/Admin_Dashboard"
import Admin_AllAlumni from "./pages/admin/Admin_AllAlumni"
import Admin_Events from "./pages/admin/Admin_Events"
import Admin_PendingAlumni from "./pages/admin/Admin_PendingAlumni"
import Student_Dashboard from "./pages/student/Student_Dashboard"
import Student_Events from "./pages/student/Student_Events"
import Student_Profile from "./pages/student/Student_Profile"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/alumnidashboard" element={<AlumniLayout />}>
            <Route index element={<Alumni_Dashboard />} />
            <Route path="alumnidirectory" element={<All_Alumni />} />
            <Route path="profile" element={<Alumni_Profile />} />
            <Route path="jobs" element={<Job_Page />} />
            <Route path="mentorship" element={<MentorshipHub />} />
            <Route path="events" element={<Events_alumni />} />
            <Route path="settings" element={<Settings />} />
            <Route path="spotlights" element={<Alumni_connection />} />
            <Route path="resources" element={<Job_Page />} />
            <Route path="contribute" element={<Contributions />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="/admindashboard" element={<AdminLayout />}>
            <Route index element={<Admin_Dashboard />} />
            <Route path="alumni" element={<Admin_AllAlumni />} />
            <Route path="events" element={<Admin_Events />} />
            <Route path="pending" element={<Admin_PendingAlumni />} />
          </Route>
          <Route path="/studentdashboard" element={<StudentLayout />}>
            <Route index element={<Student_Dashboard />} />
            <Route path="events" element={<Student_Events />} />
            <Route path="profile" element={<Student_Profile />} />
          </Route>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Loginpage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
