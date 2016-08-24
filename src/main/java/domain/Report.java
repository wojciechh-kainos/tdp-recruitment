package domain;

public class Report {

    private Person person;
    private Double initHours;
    private Double fullHours;


    public Report(Person person, Double initHours, Double fullHours) {
        this.initHours = initHours;
        this.person = person;
        this.fullHours = fullHours;
    }

    public Double getInitHours() {
        return initHours;
    }

    public void setInitHours(Double initHours) {
        this.initHours = initHours;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Double getFullHours() {
        return fullHours;
    }

    public void setFullHours(Double fullHours) {
        this.fullHours = fullHours;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Report report = (Report) o;

        if (person != null ? !person.equals(report.person) : report.person != null) return false;
        if (initHours != null ? !initHours.equals(report.initHours) : report.initHours != null) return false;
        return fullHours != null ? fullHours.equals(report.fullHours) : report.fullHours == null;

    }

    @Override
    public int hashCode() {
        int result = person != null ? person.hashCode() : 0;
        result = 31 * result + (initHours != null ? initHours.hashCode() : 0);
        result = 31 * result + (fullHours != null ? fullHours.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Report{" +
                "person=" + person +
                ", initHours=" + initHours +
                ", fullHours=" + fullHours +
                '}';
    }
}
