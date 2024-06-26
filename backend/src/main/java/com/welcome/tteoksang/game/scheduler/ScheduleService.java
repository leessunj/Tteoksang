package com.welcome.tteoksang.game.scheduler;

import com.welcome.tteoksang.game.exception.CronOffsetExceedOneWeekException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Service
@Slf4j
public class ScheduleService {
    private Map<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();
    @Autowired
    private TaskScheduler taskScheduler;

    public boolean hasRegistered(String key){
        return scheduledTasks.containsKey(key);
    }

    //스케쥴 등록================

    /**
     * 실행 주기와, 시작 시간으로 스케쥴 등록
     *
     * @param scheduleId
     * @param initialDelaySec 등록한 시간으로부터 {initialDelay}ms 후에 실행
     * @param periodSec       ms단위의 반복 주기
     * @param task
     */
    public void register(String scheduleId, long initialDelaySec, long periodSec, Runnable task) {
        log.debug(scheduleId + "가 등록되었습니다. 주기는 " + periodSec + ", " + initialDelaySec + " 이후부터 시작됩니다");
        ScheduledFuture<?> schedule = taskScheduler.scheduleAtFixedRate(task, new Date(System.currentTimeMillis() + initialDelaySec * 1000), periodSec * 1000);
        scheduledTasks.put(scheduleId, schedule);
    }

    /**
     * 실행 주기로 스케쥴 등록
     *
     * @param scheduleId
     * @param periodSec  ms단위의 반복 주기
     * @param task
     */
    public void register(String scheduleId, long periodSec, Runnable task) {
        log.debug(scheduleId + "가 등록되었습니다. 주기는 " + periodSec);
        ScheduledFuture<?> schedule = taskScheduler.scheduleAtFixedRate(task, periodSec * 1000);
        scheduledTasks.put(scheduleId, schedule);
    }

    /**
     * cron 시간에 한 번 실행되는 스케쥴 등록
     * 주에 1번 실행
     *
     * @param scheduleId
     * @param cron
     * @param task
     */
    public void register(String scheduleId, String cron, Runnable task) {
        log.debug(scheduleId + "가 등록되었습니다. 주에 한 번 실행됩니다 -> " + cron);
        ScheduledFuture<?> schedule = taskScheduler.schedule(
                task,
                new CronTrigger(cron)
        );
        scheduledTasks.put(scheduleId, schedule);
    }


    /**
     * cron 시간으로부터 {offset}초만큼 이동한 시간에 한 번 실행되는 스케쥴 등록
     * 주에 1번 실행
     *
     * @param scheduleId
     * @param initialCron
     * @param offsetSec
     */
    public void register(String scheduleId, String initialCron, long offsetSec, Runnable task) {
        register(scheduleId, createGeneralCronPerWeek(initialCron, offsetSec), task);
    }

    /**
     *
     * @param scheduleId
     * @param dateTime
     * @param task
     */
    public void register(String scheduleId, LocalDateTime dateTime, Runnable task) {
        register(scheduleId,changelocalDateTimeToCron(dateTime),task);
    }
    public void register(String scheduleId,  LocalDateTime initialDateTime, long offsetSec, Runnable task) {
        register(scheduleId, initialDateTime.plusSeconds(offsetSec), task);
    }

    //스케쥴 삭제============================
    public void remove(String scheduleId) {
        log.debug(scheduleId + "를 찾습니다...");
        if (scheduledTasks.containsKey(scheduleId)) {
            log.info(scheduleId + "를 종료합니다.");
            log.info("종료상태 " + scheduledTasks.get(scheduleId).cancel(false));
        }
    }

    //등록된 모든 스케쥴 삭제
    public void removeAllSchedule() {
        for (String key : scheduledTasks.keySet()) {
            remove(key);
        }
    }

    public void removeAllScheduleExceptKey(String remainKey){
        for (String key : scheduledTasks.keySet()) {
            if(key.equals(remainKey)) continue;
            remove(key);
        }
    }

    //utils==================

    /**
     * cron 형식으로 변환
     * @param dateTime
     * @return
     */
    public String changelocalDateTimeToCron(LocalDateTime dateTime){
        return new StringBuffer().append(dateTime.getSecond()).append(" ")
                .append(dateTime.getMinute()).append(" ")
                .append(dateTime.getHour()).append(" ")
                .append(dateTime.getDayOfMonth()).append(" ")
                .append(dateTime.getMonth().getValue()).append(" ")
                .append(dateTime.getDayOfWeek().getValue() % 7).toString();
    }

    /**
     * 기준 cron으로부터 특정 초 이후의 cron 생성
     *
     * @param cron
     * @param offsetSec
     * @return
     */
    public String createGeneralCronPerWeek(String cron, long offsetSec) {
        long sec = offsetSec % 60;
        offsetSec /= 60;
        long min = offsetSec % 60;
        offsetSec /= 60;
        long hour = offsetSec % 24;
        offsetSec /= 24;
        long day = offsetSec;
        log.debug("Offset is " + sec + "s " + min + "m " + hour + "h " + day + "d");
        if (day >= 7) throw new CronOffsetExceedOneWeekException();
        String[] crons = cron.split(" ");
        sec += Integer.parseInt(crons[0]);
        if (sec >= 60) {
            sec %= 60;
            min += 1;
        }
        min += Integer.parseInt(crons[1]);
        if (min >= 60) {
            min %= 60;
            hour += 1;
        }
        hour += Integer.parseInt(crons[2]);
        if (hour >= 24) {
            hour %= 24;
            day += 1;
        }
        if (day > 7) throw new CronOffsetExceedOneWeekException();
        day += Integer.parseInt(crons[5]);
        day %= 7;

        return new StringBuilder().append(sec).append(" ")
                .append(min).append(" ")
                .append(hour).append(" ")
                .append("* ")
                .append("* ")
                .append(day).toString();
    }
}
