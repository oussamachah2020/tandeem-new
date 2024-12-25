import {FC, ReactNode} from "react";
import EmptyContent from "@/common/components/atomic/EmptyContent";
import { ArrowDownUpIcon } from "lucide-react";
import { Sort } from "@/common/utils/types";

interface Props {
  isEmpty: boolean;
  headers: string[];
  children?: ReactNode;
  onSortChange?: (headerIndex: number) => void; // Callback for header clicks
}

const Datatable: FC<Props> = ({ isEmpty, headers, children, onSortChange }) =>
  isEmpty ? (
    <EmptyContent />
  ) : (
    <div className="bg-white rounded-lg border px-6 py-4 overflow-x-auto overflow-y-auto max-h-[550px] border-t border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-2 text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                <button
                  onClick={() => onSortChange?.(idx)}
                  className="flex flex-row gap-3 rounded-md hover:bg-gray-100 h-8 justify-center items-center px-2"
                >
                  <span>{header}</span>
                  <ArrowDownUpIcon className="h-4 w-4 text-gray-500" />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );

export default Datatable