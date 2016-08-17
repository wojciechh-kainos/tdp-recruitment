package domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "availability_type")
public class AvailabilityType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    private String name;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
