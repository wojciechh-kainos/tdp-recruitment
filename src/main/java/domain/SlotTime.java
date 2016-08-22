package domain;

import constants.TdpConstants;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Time;

@Entity
@Table(name = "slot_time")
@NamedQueries({
        @NamedQuery(name = "SlotTime.getAll",
                query = "select s from SlotTime s")})

public class SlotTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @Column(name = "start_time")
    private Time startTime;

    @NotNull
    @Column(name = "end_time")
    private Time endTime;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public double getSlotDurationInMinutes() {
        long duration = this.endTime.getTime() - this.startTime.getTime();
        return duration / TdpConstants.MILISECONDS_IN_HOUR;
    }
}
