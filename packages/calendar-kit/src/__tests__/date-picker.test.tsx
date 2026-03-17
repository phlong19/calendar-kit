import { format } from "date-fns";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DatePicker } from "../components/date-picker";

function dateLabel(date: Date) {
  return format(date, "PPPP");
}

describe("DatePicker", () => {
  it("commits immediately when autoApply=true", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth(), 10);

    render(<DatePicker autoApply onValueChange={onValueChange} />);

    await user.click(screen.getByPlaceholderText("Select date"));
    await user.click(
      screen.getByRole("button", {
        name: dateLabel(targetDate)
      })
    );

    expect(onValueChange).toHaveBeenLastCalledWith(targetDate);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
