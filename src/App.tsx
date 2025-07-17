import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import Form from "@/components/Form/Form";
import useAddressBook from "@/hooks/useAddressBook";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import { useFormFields } from "./hooks/useFormFields";

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className={styles.error} role="alert" aria-live="assertive">
    {message}
  </div>
);

function App() {
  const { fields, onChange, clearFields } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState(false);

  const { addAddress } = useAddressBook();

  const BASE_API_URL = process.env.NEXT_PUBLIC_URL || "";

  const transformAddress = (
    address: AddressType,
    houseNumber: string,
    index: number
  ) => ({
    ...address,
    houseNumber,
    id: `${address.postcode}-${address.street}-${houseNumber}-${index}`,
  });

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setAddresses([]);
    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_API_URL}/api/getAddresses?postcode=${encodeURIComponent(
          fields.postCode
        )}&streetnumber=${encodeURIComponent(fields.houseNumber)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const result = await response.json();
      const data: AddressType[] = result.details;
      const transformed = data.map((addr, index) =>
        transformAddress(addr, fields.houseNumber, index)
      );

      setAddresses(transformed);
    } catch (err) {
      setError("Error fetching addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!fields.firstName.trim() || !fields.lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!fields.selectedAddress || addresses.length === 0) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === fields.selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({
      ...foundAddress,
      firstName: fields.firstName,
      lastName: fields.lastName,
    });
    clearFields();
  };

  const handleClearAll = () => {
    clearFields();
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode, add personal info and done! 👏
          </small>
        </h1>
        <Form
          loading={loading}
          label="🏠 Find an address"
          onFormSubmit={handleAddressSubmit}
          submitText={loading ? "Finding..." : "Find"}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: fields.postCode,
                onChange,
              },
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              extraProps: {
                value: fields.houseNumber,
                onChange,
              },
            },
          ]}
        />
        {loading && <p>Loading addresses...</p>}
        {addresses.length > 0 &&
          addresses.map((address) => (
            <Radio
              name="selectedAddress"
              id={address.id}
              key={address.id}
              onChange={onChange}
              checked={fields.selectedAddress === address.id}
            >
              <Address {...address} />
            </Radio>
          ))}
        {fields.selectedAddress && (
          <Form
            loading={loading}
            label="✏️ Add personal info to address"
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  value: fields.firstName,
                  onChange,
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  value: fields.lastName,
                  onChange,
                },
              },
            ]}
          />
        )}
        {error && <ErrorMessage message={error} />}
        <Button variant="secondary" onClick={handleClearAll} type="button">
          Clear all fields
        </Button>
      </Section>
      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
