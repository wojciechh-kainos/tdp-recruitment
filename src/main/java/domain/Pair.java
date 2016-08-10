package domain;


import java.io.Serializable;
import java.util.List;

public class Pair implements Serializable {
    private Persons searchPerson;
    private Persons matchPerson;
    private List<Slots> slots;

    public Pair(Persons searchPerson, Persons matchPerson, List<Slots> slots) {
        this.searchPerson = searchPerson;
        this.matchPerson = matchPerson;
        this.slots = slots;
    }

    public Pair(){
    }

    public Persons getSearchPerson() {
        return searchPerson;
    }

    public void setSearchPerson(Persons searchPerson) {
        this.searchPerson = searchPerson;
    }

    public Persons getMatchPerson() {
        return matchPerson;
    }

    public void setMatchPerson(Persons matchPerson) {
        this.matchPerson = matchPerson;
    }

    public List<Slots> getSlots() {
        return slots;
    }

    public void setSlots(List<Slots> slots) {
        this.slots = slots;
    }
}
