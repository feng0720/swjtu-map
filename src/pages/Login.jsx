import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import library from "../assets/library.jpg";
import light_logo from "../assets/xiaohui.png";
import nanmen from "../assets/nanmen.jpg"
import dark_logo from "../assets/whitexiaohui.png";
import { CaseUpper } from "lucide-react";

export default function LogIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode,setVerificationCode] = useState("")
  const [name, setName] = useState(() => localStorage.getItem('userName') || "");
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'zh');

  const handleVerify = ()=>{
    if(CaseUpper(verificationCode)==="SWJTU"){
      return true;
    }
    return false;
  }
  useEffect(() => {
    // 如果从注册页跳转回来，预填学号和姓名
    if (location && location.state) {
      if (location.state.studentId) setStudentId(location.state.studentId);
      if (location.state.name) setName(location.state.name);
    }
  }, [location]);

  // 登录按钮点击事件
  const handleLogin = () => {
    if (!studentId || !name || !password || !verificationCode) {
      alert("请完整填写所有信息");
      return;
    }
    if((verificationCode.toUpperCase())!=="SWJTU"){
      alert("验证码不正确")
      return;
    }

    // 简单本地验证：检查 users 存储（模拟）
    try {
      const raw = localStorage.getItem('users') || '{}';
      const users = JSON.parse(raw || '{}');
      const u = users[studentId];
      if (u && u.password !== password) {
        alert('学号或密码错误（本地验证）');
        return;
      }
    } catch (e) {
      // ignore parse error, allow login
    }

    // 登录成功后保存到 localStorage 并导航到加载页（加载页会再跳回主页）
    localStorage.setItem('loginStatus', '2');
    localStorage.setItem('userName', name);
    navigate('/loading');
  };

  return (
    <div className="relative h-screen overflow-hidden flex justify-center items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${library})`, filter: 'blur(0px) brightness(1.0)' }}
        aria-hidden="true"
      ></div>

      <div className="absolute top-[3%] left-[3%]">
        <img src={light_logo} alt="西南交大校徽" className="w-64" />
      </div>
      <div className="relative w-[30%] z-10 bg-white/50 dark:bg-black/50 rounded-2xl p-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-[3%] right-[3%] text-black font-black hover:text-black dark:hover:text-white dark:text-gray-300"
          title={language === 'zh' ? '返回' : 'Back'}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-cyan-800 dark:text-gray-200">
          {language === 'zh' ? '登录校园导航系统' : 'Log in to the campus navigation system'}
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm mb-1 dark:text-gray-300">{language === 'zh' ? '学号' : 'Student ID'}</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white"
              placeholder={language === 'zh' ? '请输入学号' : 'Please enter your student ID.'}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 dark:text-gray-300">{language === 'zh' ? '姓名' : 'Name'}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white"
              placeholder={language === 'zh' ? '请输入姓名' : 'Please enter your name.'}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 dark:text-gray-300">{language === 'zh' ? '密码' : 'Password'}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white"
              placeholder={language === 'zh' ? '请输入密码' : 'Please enter your Password.'}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="flex flex-col flex-nowrap">
            <label className="text-sm mb-1 dark:text-gray-300">{language === 'zh' ? '验证码' : 'Verification code'}</label>
            <div className="flex">
            <input
              type="verification"
              value={verificationCode}
              onChange={(e)=>setVerificationCode(e.target.value)}
              className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white flex-1"
              placeholder={language === 'zh' ? '请输入验证码' : 'Please enter Verification code.'}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <div className="rounded-xl bg-white w-[30%] ml-2 flex justify-center items-center dark:bg-slate-800 dark:text-white font-black">SWJTU</div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
          >
            登录
          </button>

          <div className="mt-2 text-center text-sm">
            <button onClick={() => navigate('/register')} className="text-blue-600 hover:underline">{language === 'zh' ? '没有账号？注册' : 'No account? Register'}</button>
          </div>
        </div>
        </div>
      </div>
  );
}
