package domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "notes")
@NamedQueries({
    @NamedQuery(name = "Notes.getNoteByPersonIdAndDate", query = "select n from Notes n where person.id = :id and date = :date"),
    @NamedQuery(name = "Notes.deleteNoteForWeek", query = "delete from Notes where person.id = :id and date = :date")
})
public class Notes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @JoinColumn(name = "person")
    @ManyToOne(fetch = FetchType.EAGER)
    private Persons person;

    @NotNull
    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "date")
    private Date date;

    public Notes(Long id, Persons person, String description, Date date) {
        this.id = id;
        this.person = person;
        this.description = description;
        this.date = date;
    }

    public Notes(Persons person, String description, Date date) {
        this.person = person;
        this.description = description;
        this.date = date;
    }

    public Notes() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Persons getPerson() {
        return person;
    }

    public void setPerson(Persons person) {
        this.person = person;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
