import {FC, useState} from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { getDownloadUrl } from "@/common/utils/functions";
import { Dropdown } from "@/common/components/global/Dropdown";
import { DropdownItem } from "@/common/components/global/DropdownItem";
import Link from "@/common/components/atomic/Link";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import { SectionName } from "@/common/security/Sections";
import { useAuthStore } from "@/zustand/auth-store";

interface Props {
  title: string;
  userImageSrc?: string;
}

export const TitleBar: FC<Props> = ({ title, userImageSrc }) => {
  const { action } = useStaticValues();
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const { logout } = useAuthStore();

  return (
    <div className="flex justify-start items-center w-full">
      <h1 className="text-3xl font-medium w-full">{title}</h1>
      <div
        onClick={() => setIsDropdownShown((isShown) => !isShown)}
        className="relative flex gap-2 justify-end items-center cursor-pointer"
      >
        <img
          src={
            userImageSrc ? getDownloadUrl(userImageSrc) : "/img/logo-blue-1.svg"
          }
          alt="User avatar"
          className={
            userImageSrc
              ? "w-14 h-14 aspect-square object-cover rounded-xl"
              : "w-10 h-10 object-contain rounded-lg"
          }
        />
        <ChevronDownIcon className="w-6 h-6 text-gray-500 hover:text-black transition duration-200" />
        <Dropdown
          isShown={isDropdownShown}
          close={() => setIsDropdownShown(false)}
        >
          <DropdownItem icon="UserIcon">
            <Link
              href="/profile"
              internal={true}
              styled={false}
              className="py-2 px-3"
            >
              {SectionName.Profile}
            </Link>
          </DropdownItem>
          <DropdownItem icon="ArrowRightOnRectangleIcon">
            <Link
              href="#"
              internal={true}
              styled={false}
              className="py-2 px-3"
              onClick={logout}
            >
              {action.signOut}
            </Link>
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
};