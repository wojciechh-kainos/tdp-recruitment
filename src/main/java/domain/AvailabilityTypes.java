package domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "availability_types")
@NamedQueries(
        @NamedQuery(name = "AvailabilityTypes.delete", query = "delete from AvailabilityTypes where id = :id")
)
public class AvailabilityTypes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    private String type;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

}
