import React, { useState } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserData } from "../lib/utils/update-user-language";
import { UserLanguagePreferenceData } from "../lib/types";
import { useForm } from "react-hook-form";
// import { getUserData } from '../lib/utils/get-user-data';

interface LanguageChangeProps {
  initialFocusRef: React.RefObject<HTMLElement>;
  finalFocusRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
  onClose: () => void;
}

const LanguageChange: React.FC<LanguageChangeProps> = ({
  initialFocusRef,
  finalFocusRef,
  isOpen,
  onClose,
}) => {
  const [isLanguageChanged, setIsLanguageChanged] = useState<boolean>(false);
  const queryClient = useQueryClient();
  console.log(isLanguageChanged);

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<UserLanguagePreferenceData>({
    mode: "onChange",
  });

  const {
    mutate: UpdateUserLanguage,
    isLoading,
    //   isError,
  } = useMutation({
    mutationFn: updateUserData,
    onSuccess: () => queryClient.invalidateQueries(["user-data"]),
    onError: (error) => console.log(error),
  });

  // const { data: user } = useQuery<User>(["user-data"], () => getUserData(), {
  //   initialData: undefined,
  // });

  const onSubmit = async (data: UserLanguagePreferenceData) => {
    console.log(data);
    await UpdateUserLanguage(data.language);
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)();
    onClose();
    setIsLanguageChanged(true);
  };
  return (
    <Modal
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose your language preference</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={3}>
            <Select
              {...register("language")}
              variant="outline"
              placeholder="Language"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
            </Select>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={isLoading}
            onClick={handleSaveClick}
            colorScheme="purple"
            mr={3}
          >
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LanguageChange;
