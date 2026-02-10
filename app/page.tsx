"use client"
import React, { useState, useEffect, useCallback, useRef } from "react";
import moment from 'moment';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Lenis from 'lenis';
import gsap from 'gsap';

export default function Home() {
  const [array, setArray] = useState(new Array(6).fill(''));
  const [timing, setTiming] = useState('');
  const [verification, setVerification] = useState(false);
  const [time, setTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [user, setUser] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [elapsedTime, setElapsedTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // MUI Theme based on darkMode state
  const muiTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#fff' : '#000',
      },
      background: {
        default: darkMode ? '#0a0a0a' : '#fafafa',
        paper: darkMode ? '#1a1a1a' : '#fff',
      },
    },
    typography: {
      fontFamily: 'inherit',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  });

  const ResetButton = styled(Button)(({ theme }) => ({
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    borderRadius: '12px',
    padding: '10px 24px',
    backdropFilter: 'blur(8px)',
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    color: darkMode ? '#fff' : '#000',
    '&:hover': {
      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    }
  }));

  const DivTotal = styled('div')(({ theme }) => ({
    position: 'fixed',
    bottom: '32px',
    left: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: darkMode ? 'rgba(20, 20, 20, 0.5)' : 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    padding: '16px',
    borderRadius: '16px',
    border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
    boxShadow: darkMode ? '0 4px 30px rgba(0, 0, 0, 0.5)' : '0 4px 30px rgba(0, 0, 0, 0.05)',
    zIndex: 50,
  }));

  const ThemeToggleButton = styled('button')(({ theme }) => ({
    position: 'fixed',
    top: '32px',
    right: '32px',
    padding: '10px',
    borderRadius: '12px',
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    color: darkMode ? '#fff' : '#000',
    cursor: 'pointer',
    zIndex: 100,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    }
  }));

  function handleClick() {
    if (!verification) {
      alert("You should select your age");
      return;
    }
    window.localStorage.setItem('loggedDate', timing);
    window.location.reload()
  }

  const handleResetClick = () => {
    window.localStorage.removeItem('loggedDate') 
    window.location.reload();
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    window.localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  function handledays(day: any) {
    if (!day) return;
    const newArray = [...array]
    newArray[0] = day.year();
    newArray[1] = day.month(); 
    newArray[2] = day.date();
    const string = newArray.join("-")
    setArray(newArray);
    if(!isNaN(newArray[0]) && !isNaN(newArray[1]) && !isNaN(newArray[2])){
      if(newArray[0] > 1900){
        setVerification(true);
        setTiming(string)
      }
    }
  }

  function handleTime(time: any) {
    if (!time) return;
    const newArray = [...array]
    newArray[3] = time.hours();
    newArray[4] = time.minutes(); 
    newArray[5] = 0;
    setArray(newArray)
    const string = newArray.join("-")
    if (!isNaN(newArray[3]) && !isNaN(newArray[4])) {
      setVerification(true);
      setTiming(string);
    }
  }

  const arrayToDate = useCallback((array: any) => {
    const momentDate = moment({
      year: parseInt(array[0]),
      month: parseInt(array[1]),
      day: parseInt(array[2]),
      hour: parseInt(array[3]),
      minute: parseInt(array[4]),
      second: parseInt(array[5]),
    });
    return momentDate;
  }, []);

  const printEverySecond = useCallback(() => {
    const currentTime = moment();
    const stringToArray = timing.split("-");
    const date = arrayToDate(stringToArray);
  
    const duration = moment.duration(currentTime.diff(date));
    setTime({
      years: duration.years(),
      months: duration.months(),
      days: duration.days() + 1,
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    });
  }, [timing, arrayToDate]);

  const updateElapsedTime = useCallback(() => {
    setElapsedTime((prevElapsedTime) => {
      const duration = moment.duration({
        years: prevElapsedTime.years,
        months: prevElapsedTime.months,
        days: prevElapsedTime.days,
        hours: prevElapsedTime.hours,
        minutes: prevElapsedTime.minutes,
        seconds: prevElapsedTime.seconds + 1,
      });
  
      if (duration.days() === 30) {
        duration.subtract(duration.days(), 'days').add(1, 'months');
      }
  
      if (duration.months() === 12) {
        duration.subtract(duration.months(), 'months').add(1, 'years');
      }
      window.localStorage.setItem('totalTime', `${duration.years()}-${duration.months()}-${duration.days()}-${duration.hours()}-${duration.minutes()}-${duration.seconds()}`);
      return {
        years: duration.years(),
        months: duration.months(),
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      };
    });
  }, []);

  useEffect(() => {
    if (initialRender) {
      const loggedData = window.localStorage.getItem('loggedDate');
      const totalTimeStr = window.localStorage.getItem('totalTime');
      const savedTheme = window.localStorage.getItem('darkMode');
      
      setTiming(loggedData ?? '');
      if (savedTheme !== null) {
        setDarkMode(JSON.parse(savedTheme));
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
      }
      
      if (loggedData) {
        setUser(true);
        if (totalTimeStr) {
          let timeArray = totalTimeStr.split("-").map(Number);
          setElapsedTime({
            years: timeArray[0] || 0,
            months: timeArray[1] || 0,
            days: timeArray[2] || 0,
            hours: timeArray[3] || 0,
            minutes: timeArray[4] || 0,
            seconds: timeArray[5] || 0,
          })
        }
        const intervalId = setInterval(() => {
          printEverySecond();
          updateElapsedTime();
        }, 1000);
        return () => clearInterval(intervalId);
      }
      setInitialRender(false);
    }
  }, [printEverySecond, updateElapsedTime, initialRender]);

  // Lenis & GSAP Integration
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Entrance Animation
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power4.out", delay: 0.2 }
      );
    }

    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      );
    }

    return () => {
      lenis.destroy();
    };
  }, [user]);

  const TimeUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      <span className={`text-4xl md:text-7xl font-bold tracking-tighter tabular-nums ${darkMode ? 'text-white' : 'text-black'}`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className={`text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-40 font-bold mt-2 ${darkMode ? 'text-white' : 'text-black'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <main className={`flex min-h-screen transition-colors duration-500 selection:bg-black selection:text-white ${darkMode ? 'bg-[#0a0a0a] text-white selection:bg-white selection:text-black' : 'bg-[#fafafa] text-[#111]'}`}>
        
        <ThemeToggleButton onClick={toggleTheme}>
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </ThemeToggleButton>

        <div className="flex flex-col w-full items-center justify-center px-6 relative overflow-hidden">
          {/* Subtle grid background */}
          <div className={`absolute inset-0 z-0 opacity-[0.03] pointer-events-none ${darkMode ? 'opacity-[0.05]' : 'opacity-[0.03]'}`} 
               style={{ backgroundImage: `radial-gradient(${darkMode ? '#fff' : '#000'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

          {user ? (
            <div ref={contentRef} className="flex flex-col items-center max-w-5xl w-full z-10">
              <h1 ref={titleRef} className="text-sm md:text-base font-bold mb-16 tracking-[0.3em] uppercase opacity-40">
                The Clock Is Ticking
              </h1>
              
              <div className="flex flex-wrap justify-center items-center gap-y-12">
                <TimeUnit value={time.years} label="years" />
                <div className={`hidden md:block text-2xl opacity-10 font-light mx-2 ${darkMode ? 'text-white' : 'text-black'}`}>:</div>
                <TimeUnit value={time.months} label="months" />
                <div className={`hidden md:block text-2xl opacity-10 font-light mx-2 ${darkMode ? 'text-white' : 'text-black'}`}>:</div>
                <TimeUnit value={time.days} label="days" />
                <div className={`hidden md:block text-2xl opacity-10 font-light mx-2 ${darkMode ? 'text-white' : 'text-black'}`}>:</div>
                <TimeUnit value={time.hours} label="hours" />
                <div className={`hidden md:block text-2xl opacity-10 font-light mx-2 ${darkMode ? 'text-white' : 'text-black'}`}>:</div>
                <TimeUnit value={time.minutes} label="minutes" />
                <div className={`hidden md:block text-2xl opacity-10 font-light mx-2 ${darkMode ? 'text-white' : 'text-black'}`}>:</div>
                <TimeUnit value={time.seconds} label="seconds" />
              </div>

              <div className="mt-24 group cursor-default">
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-20 group-hover:opacity-100 transition-all duration-700 ease-in-out">
                  Memento Mori
                </p>
              </div>
            </div>
          ) : (
            <div ref={contentRef} className="flex flex-col items-center w-full max-w-md z-10">
              <h1 className="text-5xl font-bold mb-4 tracking-tight">Age Timer</h1>
              <p className="text-gray-400 mb-12 text-center font-medium">Enter your details to begin the journey.</p>
              
              <div className={`w-full space-y-8 p-10 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border transition-colors duration-500 ${darkMode ? 'bg-[#111] border-white/5 shadow-none' : 'bg-white border-gray-50'}`}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <div className="space-y-6">
                    <DatePicker 
                      onChange={(e) => handledays(e)} 
                      label="Date of Birth"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'standard',
                          InputProps: { disableUnderline: true },
                          sx: { 
                            '& .MuiInputLabel-root': { fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', tracking: '0.1em', color: darkMode ? '#666' : '#999' },
                            '& .MuiInputBase-root': { fontSize: '1.2rem', fontWeight: 500, padding: '12px 0', borderBottom: `1px solid ${darkMode ? '#222' : '#eee'}`, color: darkMode ? '#fff' : '#000' }
                          }
                        }
                      }}
                    />
                    <TimePicker
                      label="Time of Birth"
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                      onChange={(e) => handleTime(e)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'standard',
                          InputProps: { disableUnderline: true },
                          sx: { 
                            '& .MuiInputLabel-root': { fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', tracking: '0.1em', color: darkMode ? '#666' : '#999' },
                            '& .MuiInputBase-root': { fontSize: '1.2rem', fontWeight: 500, padding: '12px 0', borderBottom: `1px solid ${darkMode ? '#222' : '#eee'}`, color: darkMode ? '#fff' : '#000' }
                          }
                        }
                      }}
                    />
                  </div>
                </LocalizationProvider>
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleClick}
                  sx={{
                    bgcolor: darkMode ? '#fff' : '#000',
                    color: darkMode ? '#000' : '#fff',
                    py: 2.5,
                    borderRadius: '16px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: darkMode ? '#eee' : '#222',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: darkMode ? 'none' : '0 10px 20px -5px rgba(0,0,0,0.1)'
                  }}
                >
                  Start Journey
                </Button>
              </div>
            </div>
          )}
        </div>

        {user && (
          <>
            <ResetButton variant="outlined" onClick={handleResetClick}>
              Reset
            </ResetButton>
            <DivTotal>
              <span className={`text-[9px] uppercase tracking-[0.2em] opacity-30 mb-2 font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Session Activity</span>
              <div className={`text-xs font-bold tabular-nums tracking-wider ${darkMode ? 'text-white/80' : 'text-black/80'}`}>
                {elapsedTime.years > 0 && `${elapsedTime.years}y `}
                {elapsedTime.months > 0 && `${elapsedTime.months}m `}
                {elapsedTime.days > 0 && `${elapsedTime.days}d `}
                {elapsedTime.hours > 0 && `${elapsedTime.hours}h `}
                {elapsedTime.minutes > 0 && `${elapsedTime.minutes}m `}
                {elapsedTime.seconds > 0 && `${elapsedTime.seconds}s`}
              </div>
            </DivTotal>
          </>
        )}
      </main>
    </ThemeProvider>
  );
}
