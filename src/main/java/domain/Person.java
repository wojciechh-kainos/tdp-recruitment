package domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.security.Principal;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "person")
@NamedQueries({
        @NamedQuery(name = "Person.delete", query = "delete from Person where id = :id"),
        @NamedQuery(name = "Person.findAllActive", query = "select p from Person p where active = true"),
        @NamedQuery(name = "Person.findAll", query = "select p from Person p")
})
public class Person implements Cloneable, Principal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Length(max = 100)
    private String email;

    @NotNull
    @Column(name = "first_name", length = 100)
    @Length(max = 35)
    private String firstName;

    @NotNull
    @Column(name = "last_name", length = 100)
    @Length(max = 35)
    private String lastName;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private Boolean admin;

    @Column(name = "is_dev")
    private Boolean isDev;

    @Column(name = "is_test")
    private Boolean isTest;

    @Column(name = "is_ops")
    private Boolean isOps;

    @Column(name = "is_other")
    private Boolean isOther;

    @NotNull
    @Column(name = "band_level")
    private Integer bandLevel;

    @JsonIgnore
    @Column(name = "activation_code")
    private String activationCode;

    @Column(name = "default_start_hour")
    private Time defaultStartHour;

    @Column(name = "default_finish_hour")
    private Time defaultFinishHour;

    private Boolean active;

    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String token;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "person")
    private List<Slot> slotList = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "person")
    private List<Note> noteList = new ArrayList<>();

    public Person() {
    }

    @Override
    public Person clone() {
        try {
            return (Person) super.clone();
        } catch (final CloneNotSupportedException ex) {
            throw new RuntimeException(ex);
        }
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public Boolean getIsDev() {
        return isDev;
    }

    public void setIsDev(Boolean isDev) {
        this.isDev = isDev;
    }

    public Boolean getIsTest() {
        return isTest;
    }

    public void setIsTest(Boolean isTest) {
        this.isTest = isTest;
    }

    public Boolean getIsOps() {
        return isOps;
    }

    public void setIsOps(Boolean isOps) {
        this.isOps = isOps;
    }

    public Boolean getIsOther() {
        return isOther;
    }

    public void setIsOther(Boolean isOther) {
        this.isOther = isOther;
    }

    public Integer getBandLevel() {
        return bandLevel;
    }

    public void setBandLevel(Integer bandLevel) {
        this.bandLevel = bandLevel;
    }

    public String getActivationCode() {
        return activationCode;
    }

    public void setActivationCode(String activationCode) {
        this.activationCode = activationCode;
    }

    public List<Slot> getSlotList() {
        return slotList;
    }

    public void setSlotList(List<Slot> slotList) {
        this.slotList = slotList;
    }

    public List<Note> getNoteList() {
        return noteList;
    }

    public void setNoteList(List<Note> noteList) {
        this.noteList = noteList;
    }

    public Time getDefaultStartHour() {return defaultStartHour;}

    public void setDefaultStartHour(Time defaultStartHour) {this.defaultStartHour = defaultStartHour;}

    public Time getDefaultFinishHour() {return defaultFinishHour;}

    public void setDefaultFinishHour(Time defaultFinishHour) {this.defaultFinishHour = defaultFinishHour;}

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", password='" + password + '\'' +
                ", admin=" + admin +
                ", isDev=" + isDev +
                ", isTest=" + isTest +
                ", isOps=" + isOps +
                ", isOther=" + isOther +
                ", bandLevel=" + bandLevel +
                ", activationCode='" + activationCode + '\'' +
                ", defaultStartHour=" + defaultStartHour +
                ", defaultFinishHour=" + defaultFinishHour +
                ", active=" + active +
                ", slotList=" + slotList +
                ", noteList=" + noteList +
                '}';
    }

    @Override
    public String getName() {
        return this.email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
