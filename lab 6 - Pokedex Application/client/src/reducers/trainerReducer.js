import { v4 as uuid } from "uuid";
const initalState = [
    {
        id: uuid(),
        name: "Default Trainer",
        selected: true,
        team: [],
    },
];

let copyState = null;
let index = 0;

const trainerReducer = (state = initalState, action) => {
    const { type, payload } = action;

    switch (type) {
        case "CREATE_TRAINER":
            console.log("payload", payload);
            return [...state, { id: uuid(), name: payload.name, team: [] }];
        case "DELETE_TRAINER":
            copyState = [...state];
            index = copyState.findIndex((x) => x.id === payload.id);
            copyState.splice(index, 1);
            return [...copyState];
        case "SELECT_TRAINER":
            copyState = [...state];
            index = copyState.findIndex((x) => x.id === payload.id);
            for (let i = 0; i < copyState.length; i++) {
                if (i != index) {
                    copyState[i].selected = false;
                }
            }
            copyState[index].selected = !copyState[index].selected;
            return [...copyState];
        case "ADD_POKEMON":
            copyState = [...state];
            index = copyState.findIndex((x) => x.id === payload.id);
            copyState[index].team.push(payload.pokemon);
            return [...copyState];
        case "REMOVE_POKEMON":
            copyState = [...state];
            index = copyState.findIndex((x) => x.id === payload.id);
            copyState[index].team = copyState[index].team.filter((id) => id !== payload.pokemon);
            return [...copyState];
        default:
            return state;
    }
};

export default trainerReducer;
