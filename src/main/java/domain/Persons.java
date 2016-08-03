package domain;

import org.hibernate.annotations.NamedQueries;
import org.hibernate.annotations.NamedQuery;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "persons")
@NamedQueries({
        @NamedQuery(name = "Persons.delete",
                query = "delete from Persons where id = :id")})
public class Persons {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String email;

    @NotNull
    @Column(name = "first_name")
    private String firstName;

    @NotNull
    @Column(name = "last_name")
    private String lastName;

    private String password;

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


    @Column(name = "activation_code")
    private String activationCode;

    private Boolean active;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "person")
    private Set<Slots> slotsList = new HashSet<Slots>();


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

    public Set<Slots> getSlotsList() {
        return slotsList;
    }

    public void setSlotsList(Set<Slots> slotsList) {
        this.slotsList = slotsList;
    }

}
