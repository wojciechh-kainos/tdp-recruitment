package domain;

import org.hibernate.annotations.Cascade;
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
    private String first_name;

    @NotNull
    private String last_name;

    private String password;

    private Boolean admin;

    private Boolean is_dev;

    private Boolean is_test;

    private Boolean is_web;

    @NotNull
    private Integer band_level;

    private String activation_code;

    private Boolean active;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
            //cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    //@Cascade(CascadeType.DELETE)
//    @Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE,
//            org.hibernate.annotations.CascadeType.DELETE,
//            org.hibernate.annotations.CascadeType.MERGE,
//            org.hibernate.annotations.CascadeType.PERSIST,
//            org.hibernate.annotations.CascadeType.DELETE_ORPHAN})

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

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
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

    public Boolean getIs_dev() {
        return is_dev;
    }

    public void setIs_dev(Boolean is_dev) {
        this.is_dev = is_dev;
    }

    public Boolean getIs_test() {
        return is_test;
    }

    public void setIs_test(Boolean is_test) {
        this.is_test = is_test;
    }

    public Boolean getIs_web() {
        return is_web;
    }

    public void setIs_web(Boolean is_web) {
        this.is_web = is_web;
    }

    public Integer getBand_level() {
        return band_level;
    }

    public void setBand_level(Integer band_level) {
        this.band_level = band_level;
    }

    public String getActivation_code() {
        return activation_code;
    }

    public void setActivation_code(String activation_code) {
        this.activation_code = activation_code;
    }

    public Set<Slots> getSlotsList() {
        return slotsList;
    }

    public void setSlotsList(Set<Slots> slotsList) {
        this.slotsList = slotsList;
    }

}
