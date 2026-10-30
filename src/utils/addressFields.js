const clean = (value) => String(value ?? "").trim();

function validateStructuredAddress(input = {}) {
  const flatNo = clean(input.flatNo);
  const floor = clean(input.floor);
  const areaName = clean(input.areaName);
  const fullAddress = clean(input.fullAddress);
  const pincode = clean(input.pincode);

  if (!flatNo) return { error: "Flat number is required" };
  if (!floor) return { error: "Floor is required" };
  if (!areaName) return { error: "Area name is required" };
  if (!fullAddress) return { error: "Address is required" };
  if (!/^\d{6}$/.test(pincode)) return { error: "Pincode must be 6 digits" };

  return {
    value: { flatNo, floor, areaName, fullAddress, pincode }
  };
}

function composeDeliveryAddress(address) {
  if (!address) return "";
  const flatNo = clean(address.flatNo);
  const floor = clean(address.floor);
  const street = clean(address.fullAddress);
  const areaName = clean(address.areaName);
  const pincode = clean(address.pincode);
  if (flatNo && street.startsWith(`Flat ${flatNo}`)) return street;

  const parts = [];
  if (flatNo) parts.push(`Flat ${flatNo}`);
  if (floor) parts.push(`Floor ${floor}`);
  if (street) parts.push(street);
  if (areaName) parts.push(areaName);
  if (pincode) parts.push(pincode);
  return parts.join(", ");
}

function toOrderDeliveryAddress(address) {
  if (!address) {
    return {
      fullAddress: "",
      latitude: undefined,
      longitude: undefined
    };
  }

  return {
    fullAddress: composeDeliveryAddress(address),
    flatNo: clean(address.flatNo) || undefined,
    floor: clean(address.floor) || undefined,
    areaName: clean(address.areaName) || undefined,
    pincode: clean(address.pincode) || undefined,
    latitude: address.latitude,
    longitude: address.longitude
  };
}

function snapshotAddress(address) {
  const delivery = toOrderDeliveryAddress(address);
  return {
    addressId: address?._id,
    label: address?.label,
    ...delivery
  };
}

module.exports = {
  validateStructuredAddress,
  composeDeliveryAddress,
  toOrderDeliveryAddress,
  snapshotAddress
};
