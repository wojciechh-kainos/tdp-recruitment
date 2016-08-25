package domain;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="recruiter_note")
@NamedQueries({
        @NamedQuery(name="RecruiterNote.findAll", query="SELECT rn FROM RecruiterNote rn ORDER BY rn.date DESC")
})
public class RecruiterNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date date;

    private String content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="recruiter")
    private Person recruiter;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Person getRecruiter() {
        return recruiter;
    }

    public void setRecruiter(Person recruiter) {
        this.recruiter = recruiter;
    }
}
