import { State } from "./state";
import { Diagnosis, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "SET_DIAGNOSE_LIST";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_ENTRY";
      payload: Patient | undefined;
    }
  | {
      type: "SET_PATIENT";
      payload: Patient;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      console.log("STATE:");
      console.log(state);
      console.log("ACTION:");
      console.log(action);
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "SET_DIAGNOSE_LIST":
      console.log("STATE:");
      console.log(state);
      console.log("ACTION:");
      console.log(action);
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnose) => ({ ...memo, [diagnose.code]: diagnose }),
            {}
          ),
          ...state.diagnoses
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
      case "ADD_ENTRY":
        return {
          ...state,
          patient: action.payload
        };
    case "SET_PATIENT":
      console.log("STATE:");
      console.log(state);
      console.log("ACTION:");
      console.log(action);
      if (state.patient !== action.payload) {
        return {
          ...state,
          patient: action.payload
        };
      } else {
        return state;
      }
      
    default:
      return state;
  }
};

export const setPatientList = (patientListFromApi: Patient[]) => {
  console.log(patientListFromApi);
  // { type: "SET_PATIENT_LIST", payload: patientListFromApi }
  return {
    type: 'SET_PATIENT_LIST' as const,
    payload:  patientListFromApi
  };
};

export const setDiagnoseList = (diagnoseListFromApi: Diagnosis[]) => {
  console.log(diagnoseListFromApi);
  // { type: "SET_PATIENT_LIST", payload: patientListFromApi }
  return {
    type: 'SET_DIAGNOSE_LIST' as const,
    payload:  diagnoseListFromApi
  };
};

export const setPatient = (patient: Patient) => {
  return {
    type: 'SET_PATIENT' as const,
    payload: patient
  };
};

export const addEntry = (patient: Patient | undefined) => {
  return {
    type: 'ADD_ENTRY' as const,
    payload: patient
  };
};