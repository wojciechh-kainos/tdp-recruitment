package domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "persons")
@NamedQueries({
        @NamedQuery(name = "Persons.delete", query = "delete from Persons where id = :id"),
        @NamedQuery(name = "Persons.findAll", query = "select p from Persons p"),
        @NamedQuery(name = "Persons.findByEmail", query = "select p from Persons p where email = :email")
})
public class Persons implements Cloneable {

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

    @JsonIgnore
    private String password;

    @JsonIgnore
    private Boolean admin;

    @Column(name = "is_dev")
    private Boolean isDev;

    @Column(name = "is_test")
    private Boolean isTest;

    @Column(name = "is_web")
    private Boolean isWeb;

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

    @JsonIgnore
    private Boolean active;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "person")
    private List<Slots> slotsList = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "person")
    private List<Notes> notesList = new ArrayList<>();


    @Override
    public Persons clone(){
        try{
            return (Persons) super.clone();
        } catch(final CloneNotSupportedException ex){
            throw new RuntimeException(ex);
        }
    }

    public Persons() {
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

    public Boolean getIsWeb() {
        return isWeb;
    }

    public void setIsWeb(Boolean isWeb) {
        this.isWeb = isWeb;
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

    public List<Slots> getSlotsList() {
        return slotsList;
    }

    public void setSlotsList(List<Slots> slotsList) {
        this.slotsList = slotsList;
    }

    public List<Notes> getNotesList() {
        return notesList;
    }

    public void setNotesList(List<Notes> notesList) {
        this.notesList = notesList;
    }

    public Time getDefaultStartHour() {return defaultStartHour;}

    public void setDefaultStartHour(Time defaultStartHour) {this.defaultStartHour = defaultStartHour;}

    public Time getDefaultFinishHour() {return defaultFinishHour;}

    public void setDefaultFinishHour(Time defaultFinishHour) {this.defaultFinishHour = defaultFinishHour;}

    @Override
    public String toString() {
        return "Persons{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", password='" + password + '\'' +
                ", admin=" + admin +
                ", isDev=" + isDev +
                ", isTest=" + isTest +
                ", isWeb=" + isWeb +
                ", bandLevel=" + bandLevel +
                ", activationCode='" + activationCode + '\'' +
                ", defaultStartHour=" + defaultStartHour +
                ", defaultFinishHour=" + defaultFinishHour +
                ", active=" + active +
                ", slotsList=" + slotsList +
                ", notesList=" + notesList +
                '}';
    }
}
