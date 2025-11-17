import React, { useState } from "react";

export default function LogIn({ log,setLog ,name,setName,language}) {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  // 登录按钮点击事件
  const handleLogin = () => {
    if (!studentId || !name || !password) {
      alert("请完整填写所有信息");
      return;
    }

    // 假装验证成功（你以后可以加真实接口）
    console.log("学号:", studentId);
    console.log("姓名:", name);
    console.log("密码:", password);

    // 登录成功后关闭弹窗并保存到localStorage
    setLog(2);
    localStorage.setItem('loginStatus', '2');
    localStorage.setItem('userName', name);
  };

  return (
    <div className="relative w-full">
      {/* 关闭按钮 */}
      <button
        onClick={() => setLog(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-black dark:hover:text-white"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4 text-center dark:text-gray-200">
        {language==='zh'?'登录校园导航系统':'Log in to the campus navigation system'}
      </h2>

      {/* 表单 */}
      <div className="flex flex-col gap-4">

        <div className="flex flex-col">
          <label className="text-sm mb-1 dark:text-gray-300">{language==='zh'?'学号':'Student ID'}</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white"
            placeholder={language==='zh'?'请输入学号':'Please enter your student ID.'}
            onKeyDown={(e)=>e.key==='Enter'&&handleLogin()}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 dark:text-gray-300">{language==='zh'?'姓名':'Name'}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white"
            placeholder={language==='zh'?'请输入姓名':'Please enter your name.'}
            onKeyDown={(e)=>e.key==='Enter'&&handleLogin()}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 dark:text-gray-300">{language==='zh'?'密码':'Password'}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded-lg bg-gray-50 dark:bg-slate-800 dark:text-white"
            placeholder={language==='zh'?'请输入密码':'Please enter your Password.'}
            onKeyDown={(e)=>e.key==='Enter'&&handleLogin()}
          />
        </div>

        {/* 登录按钮 */}
        {log!==2&&<button
          onClick={handleLogin}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
        >
          登录
        </button>}
        
      </div>
    </div>
  );
}
