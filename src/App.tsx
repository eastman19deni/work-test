import React from 'react';

// Определение типов
interface Param {
    id: number;
    name: string;
    type: 'string';
}

interface ParamValue {
    paramId: number;
    value: string;
}

interface Model {
    paramValues: ParamValue[];
    colors: Color[];
}

interface Color {
    // Пустой интерфейс, так как структура Color не определена
}

interface Props {
    params: Param[];
    model: Model;
}

interface State {
    paramValues: ParamValue[];
}

class ParamEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            paramValues: props.model.paramValues ? [...props.model.paramValues] : []
        };
    }

    handleParamChange = (paramId: number, value: string): void => {
        this.setState(prevState => {
            const newParamValues = [...prevState.paramValues];
            const existingParamIndex = newParamValues.findIndex((pv: ParamValue) => pv.paramId === paramId);
            
            if (existingParamIndex >= 0) {
                newParamValues[existingParamIndex] = { ...newParamValues[existingParamIndex], value };
            } else {
                newParamValues.push({ paramId, value });
            }
            
            return { paramValues: newParamValues };
        });
    };

    public getModel(): Model {
        return {
            ...this.props.model,
            paramValues: [...this.state.paramValues]
        };
    }

    render() {
        const { params } = this.props;
        const { paramValues } = this.state;

        if (!params || !Array.isArray(params)) {
            return <div>No parameters provided</div>;
        }

        return (
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                    {params.map((param: Param) => {
                        const currentValue = paramValues.find((pv: ParamValue) => pv.paramId === param.id)?.value || '';
                        return (
                            <tr key={param.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '8px', textAlign: 'left' }}>{param.name}</td>
                                <td style={{ padding: '8px' }}>
                                    <input
                                        type="text"
                                        value={currentValue}
                                        onChange={(e) => this.handleParamChange(param.id, e.target.value)}
                                        style={{ width: '100%', padding: '5px' }}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

// Пример использования компонента
const App: React.FC = () => {
    const params: Param[] = [
        { id: 1, name: "Назначение", type: "string" },
        { id: 2, name: "Длина", type: "string" }
    ];

    const model: Model = {
        paramValues: [
            { paramId: 1, value: "повседневное" },
            { paramId: 2, value: "макси" }
        ],
        colors: []
    };

    const editorRef = React.useRef<ParamEditor>(null);

    const handleGetModel = (): void => {
        if (editorRef.current) {
            const currentModel = editorRef.current.getModel();
            console.log("Current model:", currentModel);
            alert(JSON.stringify(currentModel, null, 2));
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2>Редактор параметров</h2>
            <ParamEditor ref={editorRef} params={params} model={model} />
            <button 
                onClick={handleGetModel}
                style={{ marginTop: '20px', padding: '10px 15px' }}
            >
                Получить текущую модель
            </button>
        </div>
    );
};

export default App;