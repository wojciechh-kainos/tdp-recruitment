package domain;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Date;

@Entity
@Table(name = "note")
@NamedQueries({
    @NamedQuery(name = "Note.getNoteByPersonIdAndDate", query = "select n from Note n where person.id = :id and date = :date"),
    @NamedQuery(name = "Note.deleteNoteForWeek", query = "delete from Note where person.id = :id and date = :date")
})
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @JoinColumn(name = "person")
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private Person person;

    @NotNull
    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "date")
    private Date date;

    public Note(Long id, Person person, String description, Date date) {
        this.id = id;
        this.person = person;
        this.description = description;
        this.date = date;
    }

    public Note(Person person, String description, Date date) {
        this.person = person;
        this.description = description;
        this.date = date;
    }

    public Note() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
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
