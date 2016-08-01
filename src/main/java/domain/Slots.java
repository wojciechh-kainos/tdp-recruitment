package domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Date;


@Entity
@Table(name = "slots")
@NamedQueries({
        @NamedQuery(name = "Slots.delete",
                query = "delete from Slots where id = :id")})
public class Slots {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "slots_date")
    private Date slotsDate;

    @NotNull
    private Long person;

    @NotNull
    private Long slot;


    @NotNull
    private Long type;

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

    public Long getPerson() {
        return person;
    }

    public void setPerson(Long person) {
        this.person = person;
    }

    public Long getSlot() {
        return slot;
    }

    public void setSlot(Long slot) {
        this.slot = slot;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }
}
