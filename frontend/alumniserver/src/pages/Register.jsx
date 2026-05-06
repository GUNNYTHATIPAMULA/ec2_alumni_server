import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phoneNumber: '',
    otp: '',
    email: '',
    emailOtp: '',
    batchStartingYear: '2023',
    batchEndingYear: '2023',
    password: '',
    confirmPassword: '',
    occupation: '',
    company: '',
    rollNumber: '',
    department: '',
    degree: '',
    termsAccepted: false
  });

  const [resendTimer, setResendTimer] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "http//localhost://8081";

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
  console.log("bvjabkjbkjbjbjkasbkjbkjsb")
  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startEmailResendTimer = () => {
    setEmailResendTimer(30);
    const interval = setInterval(() => {
      setEmailResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!formData.phoneNumber) {
      alert('Please enter phone number first');
      return;
    }

    if (!formData.phoneNumber.match(/^[0-9]{10}$/)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      // Send OTP - using query parameter as per your backend
      await axios.post(`${API_BASE_URL}/otp/send-phone`, null, {
        params: { phone: formData.phoneNumber }
      });
      setIsOtpSent(true);
      startResendTimer();
      alert(`OTP sent to ${formData.phoneNumber}`);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert(error.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // Verify OTP - send as request body
      const response = await axios.post(`${API_BASE_URL}/otp/verify-phone`, {
        phone: formData.phoneNumber,
        otp: formData.otp
      });
      console.log('Verification response:', response.data);
      setIsPhoneVerified(true);
      alert('Phone verified successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        alert(error.response.data?.detail || 'Invalid OTP');
      } else {
        alert('Failed to verify OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer === 0) {
      if (formData.phoneNumber) {
        setLoading(true);
        try {
          await axios.post(`${API_BASE_URL}/otp/send-phone`, null, {
            params: { phone: formData.phoneNumber }
          });
          alert(`OTP resent to ${formData.phoneNumber}`);
          startResendTimer();
        } catch (error) {
          console.error('Error resending OTP:', error);
          alert(error.response?.data?.detail || 'Failed to resend OTP');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleEditPhone = () => {
    setIsOtpSent(false);
    setIsPhoneVerified(false);
    setFormData(prev => ({ ...prev, otp: '' }));
    setResendTimer(0);
  };

  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      alert('Please enter email address first');
      return;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Send Email OTP - using query parameter
      await axios.post(`${API_BASE_URL}/otp/send-email`, null, {
        params: { email: formData.email }
      });
      setIsEmailOtpSent(true);
      startEmailResendTimer();
      alert(`OTP sent to ${formData.email}`);
    } catch (error) {
      console.error('Error sending email OTP:', error);
      alert(error.response?.data?.detail || 'Failed to send email OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!formData.emailOtp || formData.emailOtp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // Verify Email OTP - using query parameters
      await axios.post(`${API_BASE_URL}/otp/verify-email`, null, {
        params: {
          email: formData.email,
          otp: formData.emailOtp
        }
      });
      setIsEmailVerified(true);
      alert('Email verified successfully!');
    } catch (error) {
      console.error('Error verifying email OTP:', error);
      if (error.response) {
        alert(error.response.data?.detail || 'Invalid OTP');
      } else {
        alert('Failed to verify email OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmailOtp = async () => {
    if (emailResendTimer === 0) {
      if (formData.email) {
        setLoading(true);
        try {
          await axios.post(`${API_BASE_URL}/otp/send-email`, null, {
            params: { email: formData.email }
          });
          alert(`OTP resent to ${formData.email}`);
          startEmailResendTimer();
        } catch (error) {
          console.error('Error resending email OTP:', error);
          alert(error.response?.data?.detail || 'Failed to resend email OTP');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleEditEmail = () => {
    setIsEmailOtpSent(false);
    setIsEmailVerified(false);
    setFormData(prev => ({ ...prev, emailOtp: '' }));
    setEmailResendTimer(0);
  };

  const handleSubmit = async (e) => {
    navigate("/alumnidashboard")
    // e.preventDefault();

    // // Validate passwords
    // if (formData.password !== formData.confirmPassword) {
    //   setPasswordError('Passwords do not match');
    //   return;
    // }

    // if (formData.password && formData.password.length < 6) {
    //   setPasswordError('Password must be at least 6 characters');
    //   return;
    // }

    // // Check if phone is verified
    // if (!isPhoneVerified) {
    //   alert('Please verify your phone number first');
    //   return;
    // }

    // // Check if email is verified
    // if (!isEmailVerified) {
    //   alert('Please verify your email address first');
    //   return;
    // }

    // if (!formData.termsAccepted) {
    //   alert('Please accept the terms and conditions');
    //   return;
    // }

    // setLoading(true);
    // try {
    //   const registerData = {
    //     full_name: formData.fullName,
    //     username: formData.username,
    //     email: formData.email,
    //     phone_number: formData.phoneNumber,
    //     password: formData.password,
    //     roll_number: formData.rollNumber,
    //     department: formData.department,
    //     degree: formData.degree,
    //     batch_starting_year: parseInt(formData.batchStartingYear),
    //     batch_ending_year: parseInt(formData.batchEndingYear),
    //     occupation: formData.occupation || null,
    //     company: formData.company || null
    //   };

    //   console.log('Register data:', registerData);
    //   const response = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
    //   console.log('Registration response:', response.data);
    //   alert('Registration submitted successfully!');
    //   navigate('/login');
    // } catch (error) {
    //   console.error('Error registering:', error);
    //   if (error.response) {
    //     console.log('Error response:', error.response.data);
    //     alert(error.response.data?.detail || 'Registration failed');
    //   } else {
    //     alert('Registration failed. Please try again.');
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  const departments = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const degrees = [
    'B.Tech',
    'M.Tech',
    'MBA',
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">

            {/* Alumni Details Section */}
            <div className="mb-5">
              <div className="flex justify-center items-center">
                <h2 className="text-2xl font-bold text-amber-600 border-b border-gray-200 pb-3 mb-5">
                  Alumni Form
                </h2>
              </div>

              <div>
                <div className="flex justify-end">
                  <h2 onClick={() => navigate("/")} className="text-blue-900 font-bold hover:underline cursor-pointer">
                    Back to home
                  </h2>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Enter your roll number"
                    className="mb-5 px-4 py-2 border border-gray-300 placeholder:text-black rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border placeholder:text-black border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    className="w-full px-4 py-2 border placeholder:text-black border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full px-4 py-2 border placeholder:text-black border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-2 border border-gray-300 placeholder:text-black rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-500"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-600 mt-1">{passwordError}</p>
                  )}
                </div>

                {/* Phone Number Section */}
                <div className="mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      maxLength="10"
                      className="flex-1 px-4 py-2 border border-gray-300 placeholder:text-black rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required
                      disabled={isPhoneVerified}
                    />
                    {!isPhoneVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isOtpSent || !formData.phoneNumber || formData.phoneNumber.length !== 10 || loading}
                        className={`px-3 py-2 rounded-sm font-medium transition-all duration-200 whitespace-nowrap ${isOtpSent || !formData.phoneNumber || formData.phoneNumber.length !== 10 || loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                          }`}
                      >
                        Send OTP
                      </button>
                    )}
                    {isPhoneVerified && (
                      <div className="px-3 py-2 bg-green-100 text-green-700 rounded-sm font-medium">
                        ✓ Verified
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Address Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="flex-1 px-4 py-2 border border-gray-300 placeholder:text-black rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      required
                      disabled={isEmailVerified}
                    />
                    {!isEmailVerified && (
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        disabled={isEmailOtpSent || !formData.email || loading}
                        className={`px-3 py-2 rounded-sm font-medium transition-all duration-200 whitespace-nowrap ${isEmailOtpSent || !formData.email || loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                          }`}
                      >
                        Send OTP
                      </button>
                    )}
                    {isEmailVerified && (
                      <div className="px-3 py-2 bg-green-100 text-green-700 rounded-sm font-medium">
                        ✓ Verified
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone OTP Section */}
                {isOtpSent && !isPhoneVerified && (
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Phone OTP <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 font-mono text-center text-md tracking-wider"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={!formData.otp || formData.otp.length !== 6 || loading}
                        className={`px-3 py-2 rounded-sm font-medium transition-all duration-200 whitespace-nowrap ${!formData.otp || formData.otp.length !== 6 || loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow'
                          }`}
                      >
                        Verify OTP
                      </button>
                    </div>

                    {/* Resend Section */}
                    <div className="flex items-center justify-between mt-2">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendTimer > 0 || loading}
                        className={`text-sm font-medium transition-all duration-200 ${resendTimer > 0 || loading
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:text-blue-700 hover:underline'
                          }`}
                      >
                        {resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                      <button
                        type="button"
                        onClick={handleEditPhone}
                        className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-all duration-200"
                      >
                        Edit phone number
                      </button>
                    </div>
                  </div>
                )}

                {/* Email OTP Section */}
                {isEmailOtpSent && !isEmailVerified && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Email OTP <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="emailOtp"
                        value={formData.emailOtp}
                        onChange={handleChange}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 font-mono text-center text-md tracking-wider"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailOtp}
                        disabled={!formData.emailOtp || formData.emailOtp.length !== 6 || loading}
                        className={`px-3 py-2 rounded-sm font-medium transition-all duration-200 whitespace-nowrap ${!formData.emailOtp || formData.emailOtp.length !== 6 || loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow'
                          }`}
                      >
                        Verify OTP
                      </button>
                    </div>

                    {/* Resend Section */}
                    <div className="flex items-center justify-between mt-2">
                      <button
                        type="button"
                        onClick={handleResendEmailOtp}
                        disabled={emailResendTimer > 0 || loading}
                        className={`text-sm font-medium transition-all duration-200 ${emailResendTimer > 0 || loading
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:text-blue-700 hover:underline'
                          }`}
                      >
                        {emailResendTimer > 0 ? `Resend available in ${emailResendTimer}s` : 'Resend OTP'}
                      </button>
                      <button
                        type="button"
                        onClick={handleEditEmail}
                        className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-all duration-200"
                      >
                        Edit email
                      </button>
                    </div>
                  </div>
                )}

                {/* Batch Starting Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch Starting Year *</label>
                  <input
                    type="number"
                    name="batchStartingYear"
                    value={formData.batchStartingYear}
                    onChange={handleChange}
                    placeholder="e.g., 2020"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>

                {/* Batch Ending Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Ending Year *
                  </label>
                  <input
                    type="number"
                    name="batchEndingYear"
                    value={formData.batchEndingYear}
                    onChange={handleChange}
                    placeholder="e.g., 2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Degree */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
                    required
                  >
                    <option value="">Select Degree</option>
                    {degrees.map(degree => (
                      <option key={degree} value={degree}>{degree}</option>
                    ))}
                  </select>
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Google"
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  required
                />
                <span className="text-sm text-black">
                  I agree to the <a href="#" className="text-black hover:underline">Terms and Conditions</a> and <a href="#" className="text-black hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-400 text-black font-semibold py-3 px-6 rounded-md transition duration-200 transform hover:scale-[1.02] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-md font-bold text-blue-900">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-900 font-bold hover:underline"
                >
                  Login Now
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;