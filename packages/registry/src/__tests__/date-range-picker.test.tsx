import { addDays, addMonths, endOfWeek, format, startOfDay, startOfWeek } from "date-fns";
import { enGB, th } from "date-fns/locale";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DateRangePicker } from "../components/date-range-picker";
import type { RangePreset } from "../types";

function dateLabel(date: Date) {
  return format(date, "PPPP");
}

describe("DateRangePicker", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("does not commit on first click when autoApply=true", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 10);
    const toDate = new Date(now.getFullYear(), now.getMonth(), 14);

    render(<DateRangePicker autoApply onValueChange={onValueChange} />);

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: dateLabel(fromDate) }));

    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: dateLabel(toDate) }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith({
      from: fromDate,
      to: toDate
    });
  });

  it("does not commit draft changes until Apply when autoApply=false", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 10);
    const toDate = new Date(now.getFullYear(), now.getMonth(), 14);

    render(<DateRangePicker autoApply={false} onValueChange={onValueChange} />);

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: dateLabel(fromDate) }));
    await user.click(screen.getByRole("button", { name: dateLabel(toDate) }));

    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith({
      from: fromDate,
      to: toDate
    });
  });

  it("clear commits null", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 10);
    const toDate = new Date(now.getFullYear(), now.getMonth(), 14);

    render(
      <DateRangePicker
        autoApply={false}
        onValueChange={onValueChange}
        defaultValue={{ from: fromDate, to: toDate }}
      />
    );

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("keeps calendars consecutive when changing right month dropdown", async () => {
    const user = userEvent.setup();

    render(<DateRangePicker autoApply={false} />);

    await user.click(screen.getByPlaceholderText("Select date range"));

    await user.click(screen.getByLabelText("Next month Calendar 2"));
    await user.click(screen.getByLabelText("Next month Calendar 2"));

    expect(screen.getByLabelText("Month Calendar 1")).toHaveTextContent("May");
    expect(screen.getByLabelText("Month Calendar 2")).toHaveTextContent("June");
  });

  it("commits preset immediately when autoApply=true", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const today = startOfDay(new Date());

    render(<DateRangePicker autoApply onValueChange={onValueChange} />);

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: "Today" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith({
      from: today,
      to: today
    });
  });

  it("moves linked calendars to preset start month", async () => {
    const user = userEvent.setup();
    const now = new Date();
    const futureFrom = addMonths(startOfDay(now), 2);
    const futureTo = addDays(futureFrom, 6);

    render(
      <DateRangePicker
        autoApply={false}
        defaultValue={{ from: futureFrom, to: futureTo }}
      />
    );

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: "This month" }));

    expect(screen.getByLabelText("Month Calendar 1")).toHaveTextContent(
      format(now, "MMMM")
    );
  });

  it("hydrates custom presets from localStorage", async () => {
    const user = userEvent.setup();
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 10);
    const toDate = new Date(now.getFullYear(), now.getMonth(), 14);

    const { unmount } = render(<DateRangePicker autoApply={false} />);

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: dateLabel(fromDate) }));
    await user.click(screen.getByRole("button", { name: dateLabel(toDate) }));
    await user.type(screen.getByPlaceholderText("Custom range"), "Sprint");
    await user.click(screen.getByRole("button", { name: "Save" }));

    unmount();

    render(<DateRangePicker autoApply={false} />);

    await user.click(screen.getByPlaceholderText("Select date range"));

    expect(screen.getByRole("button", { name: "Sprint" })).toBeInTheDocument();
  });

  it("supports localized built-in preset labels", async () => {
    const user = userEvent.setup();

    render(
      <DateRangePicker
        autoApply
        labels={{
          presets: {
            today: "Hôm nay",
            yesterday: "Hôm qua"
          }
        }}
      />
    );

    await user.click(screen.getByPlaceholderText("Select date range"));

    expect(screen.getByRole("button", { name: "Hôm nay" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hôm qua" })).toBeInTheDocument();
  });

  it("applies localized labels with english fallback defaults", async () => {
    const user = userEvent.setup();

    render(
      <DateRangePicker
        autoApply={false}
        labels={{
          rangePlaceholder: "Chọn khoảng ngày",
          apply: "Áp dụng",
          presets: {
            today: "Hôm nay"
          }
        }}
      />
    );

    await user.click(screen.getByPlaceholderText("Chọn khoảng ngày"));

    expect(screen.getByRole("button", { name: "Áp dụng" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hôm nay" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yesterday" })).toBeInTheDocument();
  });

  it("uses locale for weekly preset ranges", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<DateRangePicker autoApply locale={enGB} onValueChange={onValueChange} />);

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: "This week" }));

    const today = startOfDay(new Date());
    expect(onValueChange).toHaveBeenCalledWith({
      from: startOfDay(startOfWeek(today, { locale: enGB, weekStartsOn: enGB.options?.weekStartsOn })),
      to: startOfDay(endOfWeek(today, { locale: enGB, weekStartsOn: enGB.options?.weekStartsOn }))
    });
  });

  it("uses locale for month labels", async () => {
    const user = userEvent.setup();
    const today = startOfDay(new Date());
    const expectedMonthLabel = format(new Date(today.getFullYear(), today.getMonth(), 1), "MMMM", { locale: th });

    render(<DateRangePicker autoApply={false} locale={th} />);

    await user.click(screen.getByPlaceholderText("Select date range"));

    expect(screen.getByLabelText("Month Calendar 1")).toHaveTextContent(expectedMonthLabel);
  });

  it("keeps presets panel scroll area constrained and always visible", async () => {
    const user = userEvent.setup();
    const now = startOfDay(new Date());
    const presets: RangePreset[] = Array.from({ length: 20 }, (_, index) => {
      const date = addDays(now, index);

      return {
        id: `preset-${index}`,
        label: `Preset ${index + 1}`,
        value: { from: date, to: date }
      };
    });

    render(<DateRangePicker autoApply={false} presets={presets} />);

    await user.click(screen.getByPlaceholderText("Select date range"));

    const scrollArea = screen.getByTestId("presets-scroll-area");
    expect(scrollArea).toHaveClass("h-72");
    expect(scrollArea).toHaveAttribute("data-scrollbar-visibility", "always");

    const verticalScrollbar = scrollArea.querySelector(
      '[data-slot="scroll-area-scrollbar"][data-orientation="vertical"]'
    );
    expect(verticalScrollbar).toBeInTheDocument();

    const panel = document.getElementById("presets-panel-container-card");
    expect(panel).toBeInTheDocument();
    expect(within(panel as HTMLElement).getByRole("button", { name: "Preset 20" })).toBeInTheDocument();
  });
});
