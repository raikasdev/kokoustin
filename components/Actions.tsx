import { Button, Group } from "@mantine/core";
import { IconPrinter, IconTrash } from "@tabler/icons";

export function Actions({
  poytakirja,
  remove,
}: {
  poytakirja: Poytakirja;
  remove: () => void;
}) {
  return (
    <>
      <h2>Nuorisovaltuuston kokous {poytakirja.date}</h2>
      <Group>
        <Group>
          <Button
            leftIcon={<IconPrinter size={14} />}
            onClick={() => {
              const url = new URL("/api/pdf", window.location.origin);
              url.searchParams.set("object", JSON.stringify(poytakirja));
              window.open(url.toString(), "_blank");
            }}
          >
            Tulosta (pdf)
          </Button>
          <Button
            leftIcon={<IconPrinter size={14} />}
            onClick={() => {
              const url = new URL("/api/pdf_asialista", window.location.origin);
              url.searchParams.set("object", JSON.stringify(poytakirja));
              window.open(url.toString(), "_blank");
            }}
          >
            Tulosta asialista (pdf)
          </Button>
        </Group>
        <Button
          color="red"
          leftIcon={<IconTrash size={14} />}
          onClick={() => remove()}
        >
          Poista
        </Button>
      </Group>
    </>
  );
}
