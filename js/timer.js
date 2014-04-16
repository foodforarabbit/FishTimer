var totalTime = 0;
var crst = 0;
var timer;
var running = false;
var currentRunningSplitTime;
var startTimerButton, addTimeForm, addTimeTextField, addTimeAddButton, totalTimeLabel, splitTimeContainer, splitTimeList;
$(document).ready(function(){
  console.log('hi');
  addTimeForm = $('form#addTime');
  addTimeTextField = addTimeForm.find('input#time');
  addTimeAddButton = addTimeForm.find('input#add');
  totalTimeLabel = $('#totalTime');
  splitTimeContainer = $('div#splitTimeContainer');
  splitTimeList = splitTimeContainer.find('ul');
  startTimerButton = $('#startTimer');
  skipButton = $('#skipCurrent');
  resetButton = $('#resetTimer');


  addTimeAddButton.on('click', function(){
    var parsedTimeMinutes = parseInt(addTimeTextField.val() || 0);
    console.log(parsedTimeMinutes);
    var ParsedTimeMSec = parsedTimeMinutes * 60 * 100
    totalTime += ParsedTimeMSec;
    var hours = Math.floor(ParsedTimeMSec / 60);
    var minutes = ParsedTimeMSec % 60;
    var li = $('<li/>').addClass('splitTime').attr('data-init-time', ParsedTimeMSec).attr('data-time', ParsedTimeMSec).appendTo(splitTimeList);
    var span = $('<span/>').addClass('splitTimeLabel').text(timeFromMSec(ParsedTimeMSec)).appendTo(li);
    var aaa = $('<button/>').attr("type", "button").addClass('close').appendTo(li).html("&times;");

    setTotalTime();
    addTimeTextField.val("");
    return false;
  })

  startTimerButton.on('click', function(){
    if(running == false && totalTime > 0){
      startTimer();
    } else {
      stopTimer();
    }
    return false;
  })

  skipButton.on('click', function(){
    clearCurrentSplitTime();
  })

  resetButton.on('click', function(){
    stopTimer();
    totalTime = 0;
    $.each($('li.splitTime'), function(){
      $(this).attr('data-time', $(this).attr('data-init-time'));
      $(this).removeClass('done').removeClass('current');
      thisTime = parseInt($(this).attr('data-time'));
      $(this).find('.splitTimeLabel').text(timeFromMSec(thisTime));
      totalTime += thisTime;
    })
    setTotalTime();
    currentRunningSplitTime = null;
    crst = 0;
    return false;
  })

  $(document).on('click', 'li.splitTime .close', function(){
    console.log($(this));
    var splitTimeItem = $(this).closest('li.splitTime');
    var seconds = parseInt(splitTimeItem.attr('data-time'));
    // totalTime -= seconds;
    splitTimeItem.remove();
    totalTime = 0;
    $.each($('li.splitTime'), function(){
      totalTime += parseInt($(this).attr('data-time'));
    })
    setTotalTime();
    currentRunningSplitTime = null;
    crst = 0;
    return false;
  });
});

function startTimer(){
  startTimerButton.removeClass('btn-success');
  startTimerButton.addClass('btn-danger');
  startTimerButton.text('STOP');
  running = true;
  timer = setInterval(runTimer, 1);
}

function stopTimer(){
  startTimerButton.removeClass('btn-danger');
  startTimerButton.addClass('btn-success');
  startTimerButton.text('START');
  running = false;
  window.clearInterval(timer);
}

function clearCurrentSplitTime(){
  if(typeof currentRunningSplitTime !== 'undefined' || currentRunningSplitTime !== null){
    currentRunningSplitTime.addClass('done');
    currentRunningSplitTime.removeClass('current');
    currentRunningSplitTime = null;
    crst = 0;
  }
}

function runTimer(){
  if(totalTime <= 0){
    stopTimer();
    clearCurrentSplitTime();
  } else {
    totalTime -= 1;
    setTotalTime();
    // crst == 0 && 
    while(crst == 0 && (splitTimeListItems = splitTimeList.children("li:not(.done)")).length > 0){
      if(typeof currentRunningSplitTime === 'undefined' || currentRunningSplitTime == null){
        currentRunningSplitTime = splitTimeListItems.first();
        currentRunningSplitTime.addClass('current')
        crst = parseInt(currentRunningSplitTime.attr('data-time'));
      } else {
        clearCurrentSplitTime();
      }
    }
    if(crst > 0){
      crst -= 1;
      currentRunningSplitTime.attr('data-time', crst);
      try{
        currentRunningSplitTime.find('.splitTimeLabel').text(timeFromMSec(crst));
      } catch(e){
        console.log(e);
        console.log(currentRunningSplitTime);
      }
    } else {
      stopTimer();
    }
  }
}

function timeFromMSec(time){
  var hh = Math.floor(time / 360000);
  var mm = Math.floor((time % 360000) / 6000);
  var ss = Math.floor((time % 6000) / 100);
  var ms = time % 100;
  return pad(hh, 2) + ":" + pad(mm, 2) + ":" + pad(ss, 2) + "." + pad(ms, 3);
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function setTotalTime(){
  totalTimeLabel.text(timeFromMSec(totalTime));
}