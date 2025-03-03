// CommonFilterProps are used by components which handle everything internally
// for user selection of supported filter parameters, then on-change, use the
// 'onChange' callback. Any "client" of such a callback will receive 'data' in
// the form of a key-value pair object which can be passed directly in ".where"
// for the chain of methods involved in a Spraypaint data read call.
//
// For example, an input field intended for an endpoint "employees" might allow
// the user to enter text, which then searches on the 'fullName' field; in this
// case the on-change handler would be called with "{fullName: '...text...'}".
//
// Client code usually does this for a List component, where in the model (AKA
// resource) used for Spraypaint queries is given to the component instance. In
// that case, appropriate filters supporting that resource can also be provided
// via the FilterAbilities class and related List property.
//
export interface CommonFilterProps {
  onChange: (data: any) => void;
};
