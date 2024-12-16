import {FC, ReactNode} from "react";
import EmptyContent from "@/common/components/atomic/EmptyContent";

interface Props {
    isEmpty: boolean
    headers: string[]
    children?: ReactNode
}

const Datatable: FC<Props> = ({ isEmpty, headers, children }) =>
  isEmpty ? (
    <EmptyContent />
  ) : (
    <div className="bg-white rounded-lg border px-6 py-4 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-2 text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );

export default Datatable