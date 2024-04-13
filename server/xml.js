const formatString = `<?xml version="1.0" encoding="UTF-8"?>
<!--

    vanzator 1111111111118, reprezentant fiscal RO19, cumparator 8609468
    moneda TVA =RON, moneda factura = RON

-->
<Invoice xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 ../../UBL-2.1(1)/xsd/maindoc/UBL-Invoice-2.1.xsd"
 xmlns:qdt="urn:oasis:names:specification:ubl:schema:xsd:QualifiedDataTypes-2"
 xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
 xmlns:ccts="urn:un:unece:uncefact:documentation:2"
 xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
 xmlns:udt="urn:oasis:names:specification:ubl:schema:xsd:UnqualifiedDataTypes-2"
 xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
    <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:efactura.mfinante.ro:CIUS-RO:1.0.0</cbc:CustomizationID><!--BT-24 cen.eu:en16931:2017#compliant#urn:efactura.mfinante.ro:CIUS-RO:1.0.0-->

{0}
    <cac:AccountingSupplierParty><!--BG-4 VANZATOR-->
{1}
    </cac:AccountingSupplierParty>
    <cac:AccountingCustomerParty><!--BG-7 CUMPARATOR-->
{2}
    </cac:AccountingCustomerParty>
{3}
{4}
</Invoice>
`

function dateFacturaXml(id_fac, issueDate, dueDate, curr) { return `
    <cbc:ID>${id_fac}</cbc:ID><!--BT-1-->
    <cbc:IssueDate>${issueDate}</cbc:IssueDate><!--BT-2-->
    <cbc:DueDate>${dueDate}</cbc:DueDate><!--BT-9-->
    <cbc:DocumentCurrencyCode>${curr}</cbc:DocumentCurrencyCode><!--BT-5-->
    <cbc:TaxCurrencyCode>RON</cbc:TaxCurrencyCode><!--BT-6-->
`
}

    function party(nume_companie, nr_reg, CUI) { return `
    <cac:Party>
        <cbc:EndpointID schemeID="0002">1234567890123</cbc:EndpointID><!--BT-34-->
        <cac:PartyName>
            <cbc:Name>${nume_companie}</cbc:Name><!--BT-28-->
        </cac:PartyName>
        <cac:PartyTaxScheme>
            <cbc:CompanyID>${CUI}</cbc:CompanyID><!--BT-31-->
            <cac:TaxScheme>
                <cbc:ID>VAT</cbc:ID>
            </cac:TaxScheme>
        </cac:PartyTaxScheme>
        <cac:PostalAddress><!--BG-8-->
            <cbc:StreetName>NaN</cbc:StreetName><!--BT-50-->
            <cbc:AdditionalStreetName>NaN</cbc:AdditionalStreetName><!--BT-51-->
            <cbc:CityName>NaN</cbc:CityName><!--BT-52-->
            <cbc:PostalZone>NaN</cbc:PostalZone><!--BT-53-->
            <cbc:CountrySubentity>NaN</cbc:CountrySubentity><!--BT-54-->
            <cac:AddressLine>
                <cbc:Line>NaN</cbc:Line><!--BT-163-->
            </cac:AddressLine>
            <cac:Country>
                <cbc:IdentificationCode>RO</cbc:IdentificationCode><!--BT-55-->
            </cac:Country>
        </cac:PostalAddress>
        <cac:PartyLegalEntity>
            <cbc:RegistrationName>${nume_companie}</cbc:RegistrationName><!--BT-27-->
            <cbc:CompanyID schemeID="0003">${nr_reg}</cbc:CompanyID><!--BT-30 BT-30-1-->
        </cac:PartyLegalEntity>
        <cac:Contact><!--BG-9-->
            <cbc:Name>Ion Ionescu</cbc:Name><!--BT-56-->
            <cbc:Telephone>0744123456</cbc:Telephone><!--BT-57-->
            <cbc:ElectronicMail>ion.ionescu@example.ro</cbc:ElectronicMail><!--BT-58-->
        </cac:Contact>
    </cac:Party>
    `
}

function legalTotal(tot_net, tot_no_vat){ return `
    <cac:LegalMonetaryTotal><!--BG-22-->
    		<cbc:LineExtensionAmount currencyID="RON">${tot_net}</cbc:LineExtensionAmount><!--BT-106-->
    			<cbc:TaxExclusiveAmount currencyID="RON">${tot_no_vat}</cbc:TaxExclusiveAmount><!--BT-109-->
    		<cbc:TaxInclusiveAmount currencyID="RON">${tot_net}</cbc:TaxInclusiveAmount><!--BT-112-->
    		<cbc:AllowanceTotalAmount currencyID="RON">0</cbc:AllowanceTotalAmount><!--BT-107-->
    		<cbc:ChargeTotalAmount currencyID="RON">0</cbc:ChargeTotalAmount><!--BT-108-->
    		<cbc:PrepaidAmount currencyID="RON">0</cbc:PrepaidAmount><!--BT-113-->
    		<cbc:PayableRoundingAmount currencyID="RON">0.30</cbc:PayableRoundingAmount><!--BT-114-->
    		<cbc:PayableAmount currencyID="RON">${tot_net}</cbc:PayableAmount><!--BT-115-->
    </cac:LegalMonetaryTotal>
`
}

function item(id, sum, desc, name) { return `
    <cac:InvoiceLine><!--BG-25(1)-->
        <cbc:ID>${id}</cbc:ID><!--BT-126-->
        <cbc:InvoicedQuantity>1</cbc:InvoicedQuantity><!--BT-129 BT-130-->
        <cbc:LineExtensionAmount currencyID="RON">${sum}</cbc:LineExtensionAmount><!--BT-131-->
        <cac:Item><!--BG-31-->
            <cbc:Description>${desc}</cbc:Description><!--BT-154-->
            <cbc:Name>${name}</cbc:Name><!--BT-153-->
            <cac:ClassifiedTaxCategory><!--BG-30-->
                <cbc:ID>S</cbc:ID><!--BT-151-->
                <cbc:Percent>20</cbc:Percent><!--BT-152-->
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:ClassifiedTaxCategory>	
        </cac:Item>
        <cac:Price><!--BG-29-->
            <cbc:PriceAmount currencyID="RON">${sum}</cbc:PriceAmount><!--BT-146-->
            <cbc:BaseQuantity unitCode="C62">1</cbc:BaseQuantity><!--BT-149 BT-150-->
        </cac:Price>
    </cac:InvoiceLine>
    `
}

const fac = {
    id_fac: "LOL420",
    issueDate: "14/4/2024",
    dueDate: "20/4/2024",
    curr: "RON",
    seller : {
        nume_companie: "Hello inc",
        nr_reg: "98871798579",
        CUI: "872634845718"
    },
    client : {
        nume_companie: "Bye inc",
        nr_reg: "5387685871638",
        CUI: "2353468176384"
    },
    legal : {
        tot_net: 402,
        tot_no_vat: 300
    },
    items : [
        {
            id: 1, sum: 300, desc: "jfdhskfdhd", name: "fjvkj"
        }
    ]

}

const getXML = (obj_fac) => {
    const d = dateFacturaXml(obj_fac.id_fac,
        obj_fac.issueDate,
        obj_fac.dueDate,
        obj_fac.curr)
    const {client, seller, legal, items} = obj_fac
    const l = legalTotal(legal.tot_net, legal.tot_no_vat);
    const c = party(client.nume_companie,
        client.nr_reg,
        client.CUI)
    const s = party(seller.nume_companie,
        seller.nr_reg,
        seller.CUI)
    let itemobj = ""
    
    for(j in items) {
        i = items[j]
        // append to string

        itemobj += item(i.id, i.sum, i.desc, i.name);
    }
    return formatString
        .replace("{0}", d)
        .replace("{1}", s)
        .replace("{2}", c)
        .replace("{3}", l)
        .replace("{4}", itemobj)
}

console.log(getXML(fac))

