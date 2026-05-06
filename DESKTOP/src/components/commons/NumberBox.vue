<template>
    <div class="dx-field">
        <div class="dx-field-label">{{title}}</div>
        <div class="dx-field-value">
            <DxNumberBox
            :value="defaultValue"
            :show-spin-buttons="showSpinButton"
            :show-clear-button="showClearButton"
            @value-changed="onChange"
            :read-only="readOnly"
            :disabled="disable"
        />
        </div>
    </div>
</template>

<script>
import { DxNumberBox } from 'devextreme-vue/number-box';
export default {
    components:{
        DxNumberBox
    },
    props:{
        disable:{
            type:Boolean,
            default:false
        },
        readOnly:{
            type:Boolean,
            default:false
        },
        showSpinButton:{
            type:Boolean,
            default:false
        },
        title:{
            type:String,
            default:'Title'
        },
        onChange:{
            type:Function,
            default:()=>{}
        },
        defaultValue:{
            type:Number,
            default:0
        },
        showClearButton:{
            type:Boolean,
            default:false
        }

    }
}
</script>

<style>

</style>