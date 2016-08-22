package domain;

import org.eclipse.jetty.util.annotation.Name;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="candidate")
@NamedQueries({
        @NamedQuery(name = "Candidate.findAll", query = "SELECT c from Candidate c WHERE isDeleted=false"),
        @NamedQuery(name = "Candidate.deleteById", query = "UPDATE Candidate SET isDeleted = true WHERE id = :id"),
        @NamedQuery(name = "Candidate.deleteAll", query = "DELETE FROM Candidate WHERE id = :id")
})
public class Candidate {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name="first_name")
    @Length(max=100)
    private String firstName;

    @NotNull
    @Column(name="last_name")
    @Length(max=100)
    private String lastName;

    @NotNull
    @Length(max=100)
    private String position;

    private String note;

    @NotNull
    @Column(name="is_deleted")
    private Boolean isDeleted;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="recruiter")
    private Persons recruiter;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    public Persons getRecruiter() {
        return recruiter;
    }

    public void setRecruiter(Persons recruiter) {
        this.recruiter = recruiter;
    }
}
