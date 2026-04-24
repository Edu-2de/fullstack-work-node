import Text from "./components/text";

function App() {
    return (
        <>
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
        </>
    );
}

export default App;
