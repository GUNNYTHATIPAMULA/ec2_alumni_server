import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OTP = '123456';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', username: '', phoneNumber: '', otp: '',
    email: '', emailOtp: '',
    batchStartingYear: '2023', batchEndingYear: '2023',
    password: '', confirmPassword: '',
    occupation: '', company: '', rollNumber: '', department: '', degree: '',
    termsAccepted: false
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:8000";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSendOtp = () => {
    if (!formData.phoneNumber) { alert('Please enter phone number first'); return; }
    if (!formData.phoneNumber.match(/^[0-9]{10}$/)) { alert('Please enter a valid 10-digit phone number'); return; }
    setIsOtpSent(true);
    alert(`OTP sent to ${formData.phoneNumber}`);
  };

  const handleVerifyOtp = () => {
    if (formData.otp !== OTP) { alert('Invalid OTP'); return; }
    setIsPhoneVerified(true);
    alert('Phone verified successfully!');
  };

  const handleSendEmailOtp = () => {
    if (!formData.email) { alert('Please enter email address first'); return; }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { alert('Please enter a valid email address'); return; }
    setIsEmailOtpSent(true);
    alert(`Your Email OTP is: ${OTP}`);
  };

  const handleVerifyEmailOtp = () => {
    if (formData.emailOtp !== OTP) { alert('Invalid OTP'); return; }
    setIsEmailVerified(true);
    alert('Email verified successfully!');
  };

  const handleEditPhone = () => {
    setIsOtpSent(false); setIsPhoneVerified(false);
    setFormData(prev => ({ ...prev, otp: '' }));
  };

  const handleEditEmail = () => {
    setIsEmailOtpSent(false); setIsEmailVerified(false);
    setFormData(prev => ({ ...prev, emailOtp: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match'); return;
    }
    if (formData.password && formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters'); return;
    }
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions'); return;
    }

    setLoading(true);
    try {
      const registerData = {
        full_name: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone_number: formData.phoneNumber,
        password: formData.password,
        roll_number: formData.rollNumber,
        branch: formData.department,
        degree: formData.degree,
        batch_start_year: parseInt(formData.batchStartingYear),
        batch_end_year: parseInt(formData.batchEndingYear),
        occupation: formData.occupation || null,
        company_name: formData.company || null
      };

      await axios.post(`${API_BASE_URL}/auth/register-alumni`, registerData);
      alert('Registration submitted successfully! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
      if (error.response) {
        alert(error.response.data?.detail || 'Registration failed');
      } else {
        alert('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Computer Science Engineering', 'Information Technology',
    'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering',
  ];
  const degrees = ['B.Tech', 'M.Tech', 'MBA'];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="mb-5">
              <div className="flex justify-center items-center">
                <h2 className="text-2xl font-bold text-amber-600 border-b border-gray-200 pb-3 mb-5">Alumni Form</h2>
              </div>
              <div>
                <div className="flex justify-end">
                  <h2 onClick={() => navigate("/")} className="text-blue-900 font-bold hover:underline cursor-pointer">Back to home</h2>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
                <div className="flex gap-2">
                  <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange}
                    placeholder="Enter your roll number"
                    className="mb-5 px-4 py-2 border border-gray-300 placeholder:text-black rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name"
                    className="w-full px-4 py-2 border placeholder:text-black border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username"
                    className="w-full px-4 py-2 border placeholder:text-black border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full px-4 py-2 border placeholder:text-black border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500">
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-2 border border-gray-300 placeholder:text-black rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-gray-500">
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {passwordError && <p className="text-xs text-red-600 mt-1">{passwordError}</p>}
                </div>
                <div className="mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                      placeholder="Enter 10-digit mobile number" maxLength="10"
                      className="flex-1 px-4 py-2 border border-gray-300 placeholder:text-black rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required disabled={isPhoneVerified} />
                    {!isPhoneVerified ? (
                      <button type="button" onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
                        disabled={isOtpSent || !formData.phoneNumber || formData.phoneNumber.length !== 10 || loading}
                        className={`px-3 py-2 rounded-sm font-medium whitespace-nowrap ${isOtpSent || !formData.phoneNumber || formData.phoneNumber.length !== 10 || loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`}>
                        {isOtpSent ? 'Verify OTP' : 'Send OTP'}
                      </button>
                    ) : (
                      <div className="px-3 py-2 bg-green-100 text-green-700 rounded-sm font-medium">✓ Verified</div>
                    )}
                  </div>
                  {isOtpSent && !isPhoneVerified && (
                    <div className="mt-2 flex items-center gap-2">
                      <input type="text" name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" maxLength="6"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 outline-none font-mono text-center tracking-wider" />
                      <button type="button" onClick={handleEditPhone} className="text-sm text-gray-500 hover:underline">Edit</button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com"
                      className="flex-1 px-4 py-2 border border-gray-300 placeholder:text-black rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required disabled={isEmailVerified} />
                    {!isEmailVerified ? (
                      <button type="button" onClick={isEmailOtpSent ? handleVerifyEmailOtp : handleSendEmailOtp}
                        disabled={isEmailOtpSent || !formData.email || loading}
                        className={`px-3 py-2 rounded-sm font-medium whitespace-nowrap ${isEmailOtpSent || !formData.email || loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`}>
                        {isEmailOtpSent ? 'Verify OTP' : 'Send OTP'}
                      </button>
                    ) : (
                      <div className="px-3 py-2 bg-green-100 text-green-700 rounded-sm font-medium">✓ Verified</div>
                    )}
                  </div>
                  {isEmailOtpSent && !isEmailVerified && (
                    <div className="mt-2 flex items-center gap-2">
                      <input type="text" name="emailOtp" value={formData.emailOtp} onChange={handleChange} placeholder="Enter OTP" maxLength="6"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 outline-none font-mono text-center tracking-wider" />
                      <button type="button" onClick={handleEditEmail} className="text-sm text-gray-500 hover:underline">Edit</button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch Starting Year *</label>
                  <input type="number" name="batchStartingYear" value={formData.batchStartingYear} onChange={handleChange} placeholder="e.g., 2020"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch Ending Year *</label>
                  <input type="number" name="batchEndingYear" value={formData.batchEndingYear} onChange={handleChange} placeholder="e.g., 2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <select name="department" value={formData.department} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white" required>
                    <option value="">Select Department</option>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
                  <select name="degree" value={formData.degree} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white" required>
                    <option value="">Select Degree</option>
                    {degrees.map(degree => <option key={degree} value={degree}>{degree}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                  <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="e.g., Software Engineer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g., Google"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" required />
                <span className="text-sm text-black">
                  I agree to the <a href="#" className="text-black hover:underline">Terms and Conditions</a> and <a href="#" className="text-black hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-400 text-black font-semibold py-3 px-6 rounded-md transition duration-200 transform hover:scale-[1.02] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
            <div className="mt-6 text-center">
              <p className="text-md font-bold text-blue-900">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate("/login")} className="text-blue-900 font-bold hover:underline">Login Now</button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
