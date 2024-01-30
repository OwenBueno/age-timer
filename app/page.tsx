"use client"
import React, {useState, useEffect, useCallback } from "react";
import moment from 'moment';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

export default function Home() {
  const [array, setArray] = useState(new Array(6).fill(''));
  const [timing, setTiming] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [verification, setVerification] = useState(false);
  const [time, setTime] = useState(Object);
  const [user, setUser] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const [elapsedTime, setElapsedTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const ResetButton = styled(Button)({
    position: 'fixed',
    bottom: '16px',
    right: '16px',
  });

  const DivTotal = styled('div')({
    position: 'fixed',
    bottom: '69px',
    left: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  });

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

  function handledays(day: any) {
    const newArray = [...array]
    newArray[0] = day._d.getUTCFullYear();
    newArray[1] = day._d.getUTCMonth(); 
    newArray[2] = day._d.getUTCDate();
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
    const newArray = [...array]
    newArray[3] = time._d.getHours();
    newArray[4] = time._d.getMinutes(); 
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
      year: array[0],
      month: array[1],
      day: array[2],
      hour: array[3],
      minute: array[4],
      second: array[5],
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
      days: duration.days(),
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
  
      // Assuming an average of 30.44 days per month
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
  
  function setUpElapsedTime(){
    let timeArray = totalTime.split("-").map(Number);
    setElapsedTime({
      years: timeArray[0],
      months: timeArray[1],
      days: timeArray[2],
      hours: timeArray[3],
      minutes: timeArray[4],
      seconds: timeArray[5],
    })
  }

  useEffect(() => {
    if (initialRender) {
      const loggedData = window.localStorage.getItem('loggedDate');
      const totalTime = window.localStorage.getItem('totalTime');
      setTotalTime(totalTime ?? "");
      setTiming(loggedData ?? '');
      if (loggedData) {
        setUser(true);
        if(totalTime){
          setUpElapsedTime()
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

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col h-full items-center font-mono text-sm lg:flex">
        {user ? (
          <div className="flex flex-col h-full items-center">
            <h1 className="text-2xl mx-5">Clock Is Ticking</h1>
            <p className="text-lg mx-5 text-center">
              {time.years} years {time.months} months {time.days} days {time.hours} hours {time.minutes} minutes {time.seconds} seconds
            </p>
          </div>
        ) : (
          <div>
            <div className="flex">
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <div className="m-2">
                  <DatePicker onChange={(e) => handledays(e)} label="Date of born" />
                </div>
                <div className="m-2">
                  <TimePicker
                    label="Time of born"
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    onChange={(e) => handleTime(e)}
                  />
                </div>
              </LocalizationProvider>
            </div>
            <div className="flex justify-center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={(e) => {
                  handleClick();
                }}
                id="custom-button"
              >
                Calculate
              </Button>
            </div>
          </div>
        )}
      </div>
      {user && (
        <div>
          <ResetButton variant="outlined" onClick={handleResetClick}>
            Reset
          </ResetButton>
          <DivTotal>
            <div style={{ font: '18px', color: 'black' }}>
              Total Time Spent:{" "}
              {elapsedTime.years > 0 && `${elapsedTime.years} years `}
              {elapsedTime.months > 0 && `${elapsedTime.months} months `}
              {elapsedTime.days > 0 && `${elapsedTime.days} days `}
              {elapsedTime.hours > 0 && `${elapsedTime.hours} hours `}
              {elapsedTime.minutes > 0 && `${elapsedTime.minutes} minutes `}
              {elapsedTime.seconds > 0 && `${elapsedTime.seconds} seconds`}
            </div>
          </DivTotal>
        </div>
      )}
    </main>
  );
}