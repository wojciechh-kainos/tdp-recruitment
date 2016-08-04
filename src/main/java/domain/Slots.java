package domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Date;


@Entity
@Table(name = "slots")
@NamedQueries({
        @NamedQuery(name = "Slots.delete", query = "delete from Slots where id = :id"),
        @NamedQuery(name = "Slots.getForPersonForWeek", query = "select s from Slots s" +
                " where (s.slotsDate between :startDate and :endDate) and (s.person.id = :personId)")
})

public class Slots {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "slots_date")
    private Date slotsDate;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person")
    private Persons person;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "slot")
    private SlotsTimes slot;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type")
    private AvailabilityTypes type;

    public Slots() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getSlotsDate() {
        return slotsDate;
    }

    public void setSlotsDate(Date slotsDate) {
        this.slotsDate = slotsDate;
    }

    public Persons getPerson() {
        return person;
    }

    public void setPerson(Persons person) {
        this.person = person;
    }

    public SlotsTimes getSlot() {
        return slot;
    }

    public void setSlot(SlotsTimes slot) {
        this.slot = slot;
    }

    public AvailabilityTypes getType() {
        return type;
    }

    public void setType(AvailabilityTypes type) {
        this.type = type;
    }
}
