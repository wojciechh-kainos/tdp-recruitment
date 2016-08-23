package domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import serializers.SlotSerializer;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Date;

@JsonSerialize(using = SlotSerializer.class)
@Entity
@Table(name = "slot")
@NamedQueries({
        @NamedQuery(name = "Slot.delete",
                query = "delete from Slot where id = :id"),
        @NamedQuery(name = "Slot.getForPersonForWeek", query = "select s from Slot s" +
                " where (s.slotDate between :startDate and :endDate) and (s.person.id = :personId)"),
        @NamedQuery(name = "Slot.deleteForPersonBetweenDates",
                query = "delete from Slot where person.id = :personId and slotDate between :fromDate and :toDate")
})
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "slot_date")
    private Date slotDate;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person")
    @JsonBackReference
    private Person person;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "slot_time")
    private SlotTime slotTime;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type")
    private AvailabilityType type;

    public Slot() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(Date slotDate) {
        this.slotDate = slotDate;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public SlotTime getSlotTime() {
        return slotTime;
    }

    public void setSlotTime(SlotTime slotTime) {
        this.slotTime = slotTime;
    }

    public AvailabilityType getType() {
        return type;
    }

    public void setType(AvailabilityType type) {
        this.type = type;
    }

    @Override
    public String toString(){
        return "id: " + id +
                " | person: " + person.getId() +
                " | slot: " + slotTime.getId() +
                " | start: " + slotTime.getStartTime() +
                " | end: " + slotTime.getEndTime()  +
                " | date: " + slotDate;
    }
}
