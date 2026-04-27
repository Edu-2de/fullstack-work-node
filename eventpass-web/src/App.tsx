import Button from "./components/button";
import Text from "./components/text";
import StarIcon from "./assets/icons/Star-Regular.svg?react";

function App() {
    return (
        <div className="flex flex-col gap-5">
            <div className="w-full flex flex-col items-center gap-2 bg-gray-100 mt-5">
                <Text as="h2" variant="display-xl" weight="bold">
                    Display Xl
                </Text>
                <Text as="h1" variant="title-hg" weight="bold">
                    Title Hg
                </Text>
                <Text as="p" variant="input-text" weight="bold">
                    Input
                </Text>
            </div>
            <div className="w-full flex flex-col items-center gap-2 bg-gray-100 mt-5">
                <Button>Teste</Button>
                <Button icon={StarIcon}>Teste</Button>
            </div>
        </div>
    );
}

export default App;
